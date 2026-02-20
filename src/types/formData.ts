import z from "zod"
import { insertNewRecipeFormDataSchema } from "../lib/validators"

export type NewRecipeFormData = z.infer<typeof insertNewRecipeFormDataSchema>
