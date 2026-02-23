"use client"

import { ControllerFieldState } from "react-hook-form"
import { FormItem, FormLabel, FormControl, FormMessage } from "../../ui/form"

const CustomFormItem = ({
  fieldState,
  label,
  className,
  noError,
  children,
}: {
  fieldState: ControllerFieldState
  label?: string
  className?: string
  noError?: true
  children: React.ReactNode
}) => {
  return (
    <FormItem className={`${className} w-full content-start`}>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl aria-invalid={fieldState.invalid}>{children}</FormControl>
      {noError ? null : fieldState.invalid ? (
        <FormMessage className="min-h-12" />
      ) : (
        <div className="h-12" />
      )}
    </FormItem>
  )
}

export default CustomFormItem
