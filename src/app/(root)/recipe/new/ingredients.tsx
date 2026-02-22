import { NewRecipeFormData } from "@/src/types/form"
import { useFieldArray } from "react-hook-form"
import RecipeSections from "./sections"
import SectionBody from "./section-body"

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
    <SectionBody title="Ingredients">
      <RecipeSections
        variant="ingredient"
        sectionsFieldArray={ingredientSectionsFieldArray}
      />
    </SectionBody>
  )
}

export default RecipeIngredients
