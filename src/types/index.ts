import z from "zod"
import {
  insertIngredientSchema,
  insertRecipeIngredientSchema,
  insertRecipeSchema,
  insertRecipeSectionSchema,
  insertRecipeStepSchema,
} from "@/src/lib/validators"

export type Ingredient = z.infer<typeof insertIngredientSchema>

export type RecipeIngredient = z.infer<typeof insertRecipeIngredientSchema> & {
  id: string
  ingredient: Pick<Ingredient, "name">
}

export type RecipeStep = z.infer<typeof insertRecipeStepSchema> & {
  id: string
}

export type RecipeSection = z.infer<typeof insertRecipeSectionSchema> & {
  id: string
}

export type RecipeMetadata = z.infer<typeof insertRecipeSchema> & {
  id: string
}

export type Recipe = RecipeMetadata & {
  recipeSections: Array<RecipeSection>
  recipeIngredients: Array<RecipeIngredient>
  recipeSteps: Array<RecipeStep>
}

export type SectionData<T extends RecipeIngredient | RecipeStep> = {
  id: string
  name: string
  position: number
  elements: Array<T>
}

export type RecipeData = RecipeMetadata & {
  ingredients: SectionData<RecipeIngredient>[]
  steps: SectionData<RecipeStep>[]
}
