import { ZodError } from "zod"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

// TODO: rewrite this, borrowing from the next js course
// Format errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error.name === "ZodError") {
    // Handle zod error
    const fieldErrors = JSON.parse(error.message)
      .map(({ message }: ZodError) => message)
      .join(". ")

    return fieldErrors
  } else if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    // Handle Prisma error
    const field = error.meta?.target
      ? error.meta.target[0]
      : error.meta.driverAdapterError?.cause.constraint.fields
        ? error.meta.driverAdapterError?.cause.constraint.fields[0]
        : "Field"
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
  } else {
    // Handle other errors
    return typeof error.message === "string"
      ? error.message
      : JSON.stringify(error.message)
  }
}

export function formatResponse(success: boolean, message: string) {
  return {
    success,
    message,
  }
}
