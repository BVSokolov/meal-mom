"use server"

import { auth } from "@/src/auth"
import { prisma } from "@/src/db/prisma-client"
import {
  convertToPlainObject,
  formatError,
  formatResponse,
  FormattedResponse,
} from "../utils"
import {
  NewRecipeFormData,
  NewRecipeIngredientData,
  NewRecipeStepData,
} from "@/src/types/form"
import {
  insertNewRecipeFormDataSchema,
  insertRecipeSchema,
} from "../validators"
import { Prisma } from "../generated/prisma/client"
import _ from "lodash"
import { Recipe } from "@/src/types"

export async function getRecipes() {
  const session = await auth()
  const userId = session?.user.id

  const recipes = await prisma.recipe.findMany({
    where: {
      OR: [{ public: true }, { userId }],
    },
    select: {
      id: true,
      name: true,
      servings: true,
    },
    orderBy: { name: "asc" },
  })

  return convertToPlainObject(recipes)
}

export async function getFullRecipe(
  id: string,
): Promise<FormattedResponse<Recipe>> {
  try {
    const recipe = await prisma.recipe.findFirst({
      where: { id },
      include: {
        recipeSections: {
          select: { id: true, name: true, position: true },
        },
        recipeIngredients: {
          select: {
            id: true,
            recipeSectionId: true,
            amount: true,
            amountUOM: true,
            position: true,
            ingredient: {
              select: {
                name: true,
              },
            },
          },
        },
        recipeSteps: {
          select: {
            id: true,
            position: true,
            text: true,
            recipeSectionId: true,
          },
        },
      },
    })

    if (!recipe) throw new Error("Could not find recipe")

    return formatResponse<Recipe>(
      true,
      "Recipe found",
      convertToPlainObject(recipe),
    )
  } catch (error) {
    return formatResponse(false, formatError(error))
  }
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

        const ingredientSectionIds = await tx.recipeSection.createManyAndReturn(
          {
            data: ingredientsFormData.map(({ name }, index) => ({
              name,
              recipeId,
              position: index,
            })),
            select: { id: true },
          },
        )

        console.log(
          "ASDASDASDDAD INGREDIENT SECTIONS CREATED ",
          ingredientSectionIds,
        )

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
              recipeSectionId: ingredientSectionIds[sectionIndex].id,
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
        console.log("ASDASDASDASD RECIPE INGREDIENTS CREATED")

        const stepsFormData = recipeData.steps
        const stepSectionIds = await tx.recipeSection.createManyAndReturn({
          data: stepsFormData.map(({ name }, index) => ({
            name,
            recipeId,
            position: index,
          })),
          select: { id: true },
        })

        console.log("ASDASDASDDAD STEP SECTIONS CREATED ", stepSectionIds)

        const recipeStepsData = _(stepsFormData).reduce<NewRecipeStepData[]>(
          (result, { elements }, sectionIndex) => {
            return [
              ...result,
              ...elements.map(({ text }, index) => ({
                text,
                recipeId,
                position: index,
                recipeSectionId: stepSectionIds[sectionIndex].id,
              })),
            ]
          },
          [],
        )

        console.log("ASDASDASDASD stepsdata to create ", recipeStepsData)
        await tx.recipeStep.createMany({ data: recipeStepsData })
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
}
