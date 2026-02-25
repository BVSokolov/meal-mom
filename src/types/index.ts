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

export type Recipe = z.infer<typeof insertRecipeSchema> & {
  id: string
  recipeSections: Array<RecipeSection>
  recipeIngredients: Array<RecipeIngredient>
  recipeSteps: Array<RecipeStep>
}
