"use client"

import { Button } from "@/src/components/ui/button"
import { Form, FormField } from "@/src/components/ui/form"
import { Input } from "@/src/components/ui/input"
import { insertNewRecipeFormDataSchema } from "@/src/lib/validators"
import { NewRecipeFormData } from "@/src/types/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import RecipeIngredients from "./ingredients"
import CustomFormItem from "@/src/components/shared/form/custom-form-item"
import { Switch } from "@/src/components/ui/switch"
import RecipeSteps from "./steps"
import { insertRecipe } from "@/src/lib/actions/recipe.actions"

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

  const { handleSubmit, control, formState } = form

  const onSubmit = async (formData: NewRecipeFormData) => {
    console.log(formData)
    const res = await insertRecipe(formData)
    console.log("res", res)
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-8"
        method="POST"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex-between">
          <h1 className="h1-bold">New Recipe</h1>
          <Button type="submit" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>

        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
            {/* RECIPE NAME */}
            <FormField
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <CustomFormItem fieldState={fieldState} label="Recipe Name">
                  <Input placeholder="Enter recipe name" {...field} />
                </CustomFormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
              {/* RECIPE SERVINGS */}
              <FormField
                control={control}
                name="servings"
                render={({ field, fieldState }) => (
                  <CustomFormItem
                    fieldState={fieldState}
                    className=""
                    label="Recipe Servings"
                  >
                    <Input placeholder="Enter servings" {...field} />
                  </CustomFormItem>
                )}
              />

              {/* IS PUBLIC */}
              <FormField
                control={control}
                name="public"
                render={({ field, fieldState }) => (
                  <CustomFormItem
                    fieldState={fieldState}
                    className="md:justify-end"
                    label="Make Public"
                  >
                    <Switch
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                    />
                  </CustomFormItem>
                )}
              />
            </div>
          </div>

          {/* SECTIONS OF INGREDIENTS */}
          <RecipeIngredients />

          {/* SECTIONS OF STEPS */}
          <RecipeSteps />
        </div>
      </form>
    </Form>
  )
}

export default NewRecipe
