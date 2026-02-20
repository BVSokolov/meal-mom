import { FormItem, FormLabel, FormControl, FormMessage } from "../../ui/form"

const CustomFormItem = ({
  label,
  children,
}: {
  label?: string
  children: React.ReactNode
}) => {
  return (
    <FormItem className="w-full">
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>{children}</FormControl>
      <FormMessage />
    </FormItem>
  )
}

export default CustomFormItem
