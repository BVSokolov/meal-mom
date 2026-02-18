import z from "zod"
import {
  insertRecipeIngredientSchema,
  insertRecipeSchema,
  insertRecipeSectionSchema,
  insertRecipeStepSchema,
} from "@/src/lib/validators"

export type RecipeIngredient = z.infer<typeof insertRecipeIngredientSchema>

export type RecipeStep = z.infer<typeof insertRecipeStepSchema>

export type RecipeSection = z.infer<typeof insertRecipeSectionSchema>

export type Recipe = z.infer<typeof insertRecipeSchema>
