import z from "zod"
import { insertNewRecipeFormDataSchema } from "../lib/validators"

export type NewRecipeFormData = Omit<
  z.infer<typeof insertNewRecipeFormDataSchema>,
  "userId"
>
