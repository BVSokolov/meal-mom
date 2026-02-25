import { ZodError } from "zod"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { UseFieldArrayReturn } from "react-hook-form"

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

export type FormattedResponse<T> = {
  success: boolean
  message: string
  data?: T
}
export function formatResponse<T>(
  success: boolean,
  message: string,
  data?: T,
): FormattedResponse<T> {
  return {
    success,
    message,
    data,
  }
}

// TODO type this properly
type MoveArrayFieldProps = (
  fieldArray: UseFieldArrayReturn<any, any, "field_id">,
  index: number,
  up: boolean,
) => void
export const moveFieldArrayElement: MoveArrayFieldProps = (
  fieldArray,
  index,
  up,
) => {
  const { fields: elementFields, move: moveElement } = fieldArray
  const targetIndex =
    (up ? index + elementFields.length - 1 : index + 1) % elementFields.length // we add the length if we're going up to make sure we never get a negative value
  console.log(`up ${up}, index ${index}, targetIndex ${targetIndex}`)

  console.log("same section")
  moveElement(index, targetIndex)
}
