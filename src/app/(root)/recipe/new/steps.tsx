import { NewRecipeFormData } from "@/src/types/form"
import { useFieldArray } from "react-hook-form"
import RecipeSections from "./sections"
import SectionBody from "./section-body"

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
    <SectionBody title="Steps">
      <RecipeSections
        variant="step"
        sectionsFieldArray={stepSectionsFieldArray}
      />
    </SectionBody>
  )
}

export default RecipeSteps
