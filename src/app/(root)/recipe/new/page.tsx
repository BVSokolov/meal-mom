"use client"

import { auth } from "@/src/auth"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form"
import { Input } from "@/src/components/ui/input"
import { insertNewRecipeFormDataSchema } from "@/src/lib/validators"
import { NewRecipeFormData } from "@/src/types/formData"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import z from "zod"

const NewRecipe = () => {
  const router = useRouter()
  const form = useForm<NewRecipeFormData>({
    resolver: zodResolver(insertNewRecipeFormDataSchema.omit({ userId: true })),
  })

  const { handleSubmit } = form

  const onSubmit = async (formData: NewRecipeFormData) => {
    console.log(formData)
  }

  return (
    <Form {...form}>
      <form method="POST" onSubmit={handleSubmit(onSubmit)}>
        {/* <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Recipe Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter recipe name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* RECIPE NAME */}

        {/* RECIPE SERVINGS */}

        {/* IS PUBLIC */}

        {/* INGREDIENTS */}
        {/* SECTIONS OF INGREDIENTS */}

        {/* STEPS */}
        {/* SECTIONS OF STEPS */}
      </form>
    </Form>
  )
}

export default NewRecipe
