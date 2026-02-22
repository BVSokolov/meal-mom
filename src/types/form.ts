import z from "zod"
import {
  insertNewRecipeFormDataSchema,
  insertRecipeIngredientFormDataSchema,
  insertRecipeStepFormDataSchema,
} from "../lib/validators"

export type NewRecipeFormData = z.infer<typeof insertNewRecipeFormDataSchema>

export type SectionVariant = "ingredient" | "step"

export type IngredientFormData = z.infer<
  typeof insertRecipeIngredientFormDataSchema
>
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
