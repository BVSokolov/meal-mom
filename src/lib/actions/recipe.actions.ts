"use server"

import { auth } from "@/src/auth"
import { prisma } from "@/src/db/prisma-client"
import { convertToPlainObject, formatError, formatResponse } from "../utils"
import {
  IngredientFormData,
  NewRecipeFormData,
  NewRecipeIngredientData,
  SectionFormData,
  SectionVariant,
} from "@/src/types/form"
import {
  insertIngredientSchema,
  insertNewRecipeFormDataSchema,
  insertRecipeSchema,
} from "../validators"
import z from "zod"
import { Prisma } from "../generated/prisma/client"
import _ from "lodash"

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

    const recipeData = insertNewRecipeFormDataSchema.parse(formData)
    const ingredientsFormData = recipeData.ingredients
    const formIngredientNames = _(ingredientsFormData).reduce<string[]>(
      (result, { elements }, _key) => {
        return [...result, ...elements.map((element) => element.name)]
      },
      [],
    )

    console.log("ASDASD form ingredient names ", formIngredientNames)

    const existingIngredients = await _(
      await prisma.ingredient.findMany({ select: { id: true, name: true } }),
    )
      .filter((ingredient) => formIngredientNames.includes(ingredient.name))
      .mapKeys("name")
      .value()

    console.log("ASD EXISTING", existingIngredients)

    const ingredientsToCreateNames = formIngredientNames.filter(
      (name) => !existingIngredients[name],
    )

    console.log("ASD INGREDIENTS TO CREATE NAMES ", ingredientsToCreateNames)

    const ingredientsData = _(ingredientsToCreateNames)
      .map((name) => ({ name }))
      .value()

    console.log("ASD DATA TO CREATE INGREDIENTS ", ingredientsData)

    // this needs to be part of a transaction!!!!
    await prisma.$transaction(
      async (tx) => {
        const recipeMetadata = {
          ...insertRecipeSchema.parse(recipeData),
          userId: currentUser.id,
        }

        const { id: recipeId } = await tx.recipe.create({
          select: { id: true },
          data: recipeMetadata,
        })
        console.log("ASDASDASDASDASDASD recipe", recipeId)

        const sectionIds = await tx.recipeSection.createManyAndReturn({
          data: ingredientsFormData.map(({ name }, index) => ({
            name,
            recipeId,
            position: index,
          })),
          select: { id: true },
        })

        console.log("ASDASDASDDAD SECTIONS CREATED ", sectionIds)

        const ingredientsDB = await tx.ingredient.createManyAndReturn({
          data: ingredientsData,
          select: { id: true, name: true },
          skipDuplicates: true,
        })

        console.log("ASDASDASDDAD INGREDIENTS CREATED ", ingredientsDB)

        const ingredientNameIdMap = _(ingredientsDB)
          .mapKeys("name")
          .assign(existingIngredients)
          .mapValues("id")
          .value()

        console.log("ASDASDASD TRANSFORMED ", ingredientNameIdMap)

        const recipeIngredientsData = _(ingredientsFormData).reduce<
          NewRecipeIngredientData[]
        >((result, { elements }, sectionIndex) => {
          return [
            ...result,
            ...elements.map(({ name, amount, amountUOM }, index) => ({
              amount,
              amountUOM,
              recipeId,
              position: index,
              recipeSectionId: sectionIds[sectionIndex].id,
              ingredientId: ingredientNameIdMap[name],
            })),
          ]
        }, [])

        console.log(
          "ASSDASDASDASD CREATING SECTION INGREDIENTS ",
          recipeIngredientsData,
        )

        await tx.recipeIngredient.createMany({
          data: recipeIngredientsData,
        })
        console.log("ASDASDASDASD FINISHED")
      },
      {
        maxWait: 5000,
        timeout: 20000,
        isolationLevel: Prisma.TransactionIsolationLevel.ReadUncommitted,
      },
    )

    return formatResponse(true, "Recipe saved successfully")
  } catch (error) {
    return formatResponse(false, formatError(error))
  }

  // create recipe and get its id

  // for each ingredient section
  // create section and get its id
  // for each ingredient
  // create ingredient with section id
}
