import { NewRecipeFormData } from "@/src/types/formData"
import { useFieldArray } from "react-hook-form"
import RecipeSections from "./sections"

const RecipeSteps = () => {
  const stepSectionsFieldArray = useFieldArray<
    Partial<{ steps: NewRecipeFormData["steps"] }>,
    "steps",
    "field_id"
  >({
    name: "steps",
    keyName: "field_id",
  })

  return (
    <div>
      <h4>Steps</h4>
      <RecipeSections
        variant="step"
        sectionsFieldArray={stepSectionsFieldArray}
      />
    </div>
  )
}

export default RecipeSteps
