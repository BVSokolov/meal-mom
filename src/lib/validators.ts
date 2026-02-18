import { z } from "zod"
import { QuantityUOM } from "./generated/prisma/enums"

const QTY_UOM_ENUM = [...Object.values(QuantityUOM)] as const

const NAME_ZOD_VALIDATOR = z
  .string()
  .min(3, "Name must be at least 3 characters")

const ID_ZOD_VALIDATOR = (errorMsg: string) => z.uuid().min(1, `${errorMsg}`)

// Insert Ingredient
export const insertIngredientSchema = z.object({
  name: NAME_ZOD_VALIDATOR,
})

// Insert Recipe
export const insertRecipeSchema = z.object({
  name: NAME_ZOD_VALIDATOR,
  servings: z.number().min(1, "Servings must be at least 1"),
})

// Insert Recipe Section
export const insertRecipeSectionSchema = z.object({
  recipeId: ID_ZOD_VALIDATOR("Recipe ID is required"),
  name: NAME_ZOD_VALIDATOR,
  position: z.number().min(0, "Section position must be non-negative"),
})

// Insert Recipe Ingredient
export const insertRecipeIngredientSchema = z.object({
  ingredientId: ID_ZOD_VALIDATOR("Ingredient ID is required"),
  recipeId: ID_ZOD_VALIDATOR("Recipe ID is required"),
  recipeSectionId: z.string(),
  amount: z.number().min(1, "Amount must be positive"),
  amountUOM: z.enum(QTY_UOM_ENUM),
  position: z.number().min(0, "Ingredient position must be non-negative"),
})

// Insert Recipe Step
export const insertRecipeStepSchema = z.object({
  recipeId: ID_ZOD_VALIDATOR("Recipe ID is required"),
  recipeSectionId: z.string(),
  position: z.number().min(0, "Ingredient position must be non-negative"),
  text: z.string().min(10, "Recipe step must be at least 10 characters long"),
})

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
