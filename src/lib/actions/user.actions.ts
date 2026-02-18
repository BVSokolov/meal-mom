"use server"

import { signInFormSchema, signUpFormSchema } from "../validators"
import { signIn, signOut } from "@/src/auth"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { formatError, formatResponse } from "../utils"
import { hashSync } from "bcrypt-ts-edge"
import { prisma } from "@/src/db/prisma-client"

// Sign in the user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    })
    await signIn("credentials", user)

    return formatResponse(true, "Signed in successfully")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return formatResponse(false, "Invalid email or password")
  }
}

// Sign user out
export async function signOutUser() {
  await signOut()
}

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    })

    const plainPassword = user.password
    user.password = hashSync(plainPassword, 10)

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    })

    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    })

    return formatResponse(true, "User registered successfully")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return formatResponse(false, formatError(error))
  }
}

// Get user by the ID
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  })
  if (!user) throw new Error("User not found")
  return user
}
