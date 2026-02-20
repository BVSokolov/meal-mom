"use server"

import { auth } from "@/src/auth"
import { prisma } from "@/src/db/prisma-client"
import { convertToPlainObject, formatError, formatResponse } from "../utils"
import { NewRecipeFormData } from "@/src/types/formData"
import {
  insertIngredientSchema,
  insertNewRecipeFormDataSchema,
  insertRecipeSchema,
} from "../validators"
import z from "zod"
import { Prisma } from "../generated/prisma/client"

export async function getRecipes() {
  const session = await auth()
  const userId = session?.user.id

  const recipes = await prisma.recipe.findMany({
    where: {
      OR: [{ public: true }, { userId }],
    },
    orderBy: { name: "asc" },
  })

  return convertToPlainObject(recipes)
}

{
  /**
  formData: {
    name,
    servings,
    public,
    ingredients: [
      {
        name: sectionName,
        elements: [
          {
            name,
            position,
            amount,
            amountUOM
          }
        ]
      }
    ]
  }
  */
}

async function gotIngredientId(
  tx: Prisma.TransactionClient,
  ingredient: z.infer<typeof insertIngredientSchema>,
) {
  const ingredientId =
    (
      await prisma.ingredient.findFirst({
        where: { name: ingredient.name },
        select: { id: true },
      })
    )?.id || null

  return (
    ingredientId ??
    (
      await tx.ingredient.create({
        data: { name: ingredient.name },
        select: { id: true },
      })
    ).id
  )
}

export async function insertRecipe(formData: NewRecipeFormData) {
  try {
    const session = await auth()
    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    })

    if (!currentUser) throw new Error("User not found")

    // this needs to be part of a transaction!!!!
    await prisma.$transaction(async (tx) => {
      const recipeData = insertNewRecipeFormDataSchema.parse(formData)
      const recipeMetadata = {
        ...insertRecipeSchema.parse(recipeData),
        userId: currentUser.id,
      }

      const { id: recipeId } = await tx.recipe.create({
        select: { id: true },
        data: recipeMetadata,
      })

      const ingredientsFormData = recipeData.ingredients
      ingredientsFormData.forEach(async ({ name, elements }, index) => {
        const { id: recipeSectionId } = await tx.recipeSection.create({
          data: { recipeId, name, position: index },
          select: { id: true },
        })

        elements.forEach(async (recipeIngredient, index) => {
          const ingredientId = await gotIngredientId(tx, recipeIngredient)
          await tx.recipeIngredient.create({
            data: {
              ...recipeIngredient,
              ingredientId,
              recipeSectionId,
              recipeId,
              position: index,
            },
          })
        })
      })
    })

    return formatResponse(true, "User updated successfully")
  } catch (error) {
    return formatResponse(false, formatError(error))
  }

  // create recipe and get its id

  // for each ingredient section
  // create section and get its id
  // for each ingredient
  // create ingredient with section id
}
