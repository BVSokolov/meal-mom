import { z } from "zod"
import { QuantityUOM } from "./generated/prisma/enums"

const QTY_UOM_ENUM = [...Object.values(QuantityUOM)] as const

const NAME_ZOD_VALIDATOR = z
  .string()
  .min(3, "Name must be at least 3 characters")

const ID_ZOD_VALIDATOR = (errorMsg: string) => z.uuid().min(1, `${errorMsg}`)

// DATABASE TABLE VALIDATORS
//
//

// Insert Recipe
export const insertRecipeSchema = z.object({
  name: NAME_ZOD_VALIDATOR,
  servings: z.coerce.number<number>().min(1, "Servings must be at least 1"),
  public: z.boolean(),
})

// Insert Recipe Section
export const insertRecipeSectionSchema = z.object({
  name: NAME_ZOD_VALIDATOR,
  position: z.number().min(0, "Section position must be non-negative"),
})

// Insert Ingredient
export const insertIngredientSchema = z.object({
  name: NAME_ZOD_VALIDATOR,
})

// Insert Recipe Ingredient
export const insertRecipeIngredientSchema = z.object({
  amount: z.coerce.number<number>().min(1, "Amount must be positive"),
  amountUOM: z.enum(QTY_UOM_ENUM),
  position: z.number().min(0, "Ingredient position must be non-negative"),
})

// Insert Recipe Step
export const insertRecipeStepSchema = z.object({
  position: z.number().min(0, "Ingredient position must be non-negative"),
  text: z.string().min(5, "Recipe step must be at least 5 characters long"),
})

// FORM DATA VALIDATORS
//
//

export const insertRecipeIngredientFormDataSchema = insertRecipeIngredientSchema
  .omit({ position: true })
  .extend(insertIngredientSchema.shape)

export const insertRecipeStepFormDataSchema = insertRecipeStepSchema.omit({
  position: true,
})

// Insert New Recipe Form Data
export const insertNewRecipeFormDataSchema = insertRecipeSchema.extend({
  ingredients: z.array(
    z.object({
      name: z.string(),
      elements: z.array(insertRecipeIngredientFormDataSchema),
    }),
  ),
  steps: z.array(
    z.object({
      name: z.string(),
      elements: z.array(insertRecipeStepFormDataSchema),
    }),
  ),
})

// AUTHENTICATION VALIDATORS
//
//

// Schema for signing user in
const MIN_PW_LENGTH = 6
export const signInFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(
      MIN_PW_LENGTH,
      `Password must be at least ${MIN_PW_LENGTH} characters`,
    ),
})

// Schema for signing up a user
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(
        MIN_PW_LENGTH,
        `Password must be at least ${MIN_PW_LENGTH} characters`,
      ),
    confirmPassword: z
      .string()
      .min(
        MIN_PW_LENGTH,
        `Confirm password must be at least ${MIN_PW_LENGTH} characters`,
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
