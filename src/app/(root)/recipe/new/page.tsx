"use client"

import { Button } from "@/src/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form"
import { Input } from "@/src/components/ui/input"
import { insertRecipe } from "@/src/lib/actions/recipe.actions"
import { insertNewRecipeFormDataSchema } from "@/src/lib/validators"
import { NewRecipeFormData } from "@/src/types/formData"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import RecipeIngredients from "./ingredients"
import React from "react"
import CustomFormItem from "@/src/components/shared/form/custom-form-item"

const NewRecipe = () => {
  const router = useRouter()
  const form = useForm<NewRecipeFormData>({
    resolver: zodResolver(insertNewRecipeFormDataSchema),
    defaultValues: {
      name: "",
      public: false,
      servings: 1,
      ingredients: [],
    },
  })

  const { handleSubmit, control } = form

  const onSubmit = async (formData: NewRecipeFormData) => {
    console.log(formData)
    const res = await insertRecipe(formData)
    console.log("res", res)
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        method="POST"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex-between mb-4">
          <h1 className="h1-bold">New Recipe</h1>
          <Button type="submit">Save</Button>
        </div>

        {/* RECIPE NAME */}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <CustomFormItem label="Recipe Name">
              <Input placeholder="Enter recipe name" {...field} />
            </CustomFormItem>
          )}
        />

        {/* RECIPE SERVINGS */}

        {/* IS PUBLIC */}

        {/* INGREDIENTS */}
        <RecipeIngredients />
        {/* SECTIONS OF INGREDIENTS */}

        {/* STEPS */}
        {/* SECTIONS OF STEPS */}
      </form>
    </Form>
  )
}

export default NewRecipe
