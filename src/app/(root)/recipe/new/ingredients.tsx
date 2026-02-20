import { NewRecipeFormData } from "@/src/types/formData"
import { useFieldArray } from "react-hook-form"
import RecipeSections from "./sections"

const RecipeIngredients = () => {
  const ingredientSectionsFieldArray = useFieldArray<
    Partial<{ ingredients: NewRecipeFormData["ingredients"] }>,
    "ingredients",
    "field_id"
  >({
    name: "ingredients",
    keyName: "field_id",
  })

  return (
    <div>
      <h4>Ingredients</h4>
      <RecipeSections
        variant="ingredient"
        sectionsFieldArray={ingredientSectionsFieldArray}
      />
    </div>
  )
}

export default RecipeIngredients
