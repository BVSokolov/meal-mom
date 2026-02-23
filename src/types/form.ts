import z from "zod"
import {
  insertNewRecipeFormDataSchema,
  insertRecipeIngredientFormDataSchema,
  insertRecipeIngredientSchema,
  insertRecipeStepFormDataSchema,
  insertRecipeStepSchema,
} from "../lib/validators"

export type NewRecipeFormData = z.infer<typeof insertNewRecipeFormDataSchema>

export type SectionVariant = "ingredient" | "step"

export type IngredientFormData = z.infer<
  typeof insertRecipeIngredientFormDataSchema
>

export type NewRecipeIngredientData = z.infer<
  typeof insertRecipeIngredientSchema
> & {
  recipeSectionId: string
  recipeId: string
  ingredientId: string
}

export type NewRecipeStepData = z.infer<typeof insertRecipeStepSchema> & {
  recipeSectionId: string
  recipeId: string
}

export type StepFormData = z.infer<typeof insertRecipeStepFormDataSchema>

export type SectionFormData<T extends SectionVariant> = {
  name: string
  elements: Array<T extends "ingredient" ? IngredientFormData : StepFormData>
}

export type SectionFieldArray<T extends SectionVariant> = Partial<
  T extends "ingredient"
    ? {
        ingredients: Array<SectionFormData<"ingredient">>
      }
    : {
        steps: Array<SectionFormData<"step">>
      }
>
