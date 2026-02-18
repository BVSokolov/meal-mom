import z from "zod"
import {
  insertIngredientSchema,
  insertRecipeIngredientSchema,
  insertRecipeSchema,
  insertRecipeSectionSchema,
  insertRecipeStepSchema,
} from "@/src/lib/validators"

export type RecipeIngredient = z.infer<typeof insertRecipeIngredientSchema> &
  z.infer<typeof insertIngredientSchema> & {
    id: string
  }

export type RecipeStep = z.infer<typeof insertRecipeStepSchema> & {
  id: string
}

export type RecipeSection = z.infer<typeof insertRecipeSectionSchema> & {
  id: string
}

export type Recipe = z.infer<typeof insertRecipeSchema> & {
  id: string
  sections: Array<RecipeSection>
  ingredients: Array<RecipeIngredient>
  steps: Array<RecipeStep>
}
