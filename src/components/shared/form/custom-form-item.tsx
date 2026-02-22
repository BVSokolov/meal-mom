"use client"

import { ControllerFieldState } from "react-hook-form"
import { FormItem, FormLabel, FormControl, FormMessage } from "../../ui/form"

const CustomFormItem = ({
  fieldState,
  label,
  className,
  children,
}: {
  fieldState: ControllerFieldState
  label?: string
  className?: string
  children: React.ReactNode
}) => {
  return (
    <FormItem className={`${className} w-full content-start`}>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl aria-invalid={fieldState.invalid}>{children}</FormControl>
      {fieldState.invalid ? (
        <FormMessage className="min-h-12" />
      ) : (
        <div className="h-12" />
      )}
    </FormItem>
  )
}

export default CustomFormItem
