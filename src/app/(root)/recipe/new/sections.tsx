import PositionalButtons from "@/src/components/shared/form/positional-buttons"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { moveFieldArrayElement } from "@/src/lib/utils"
import { SectionFieldArray, SectionVariant } from "@/src/types/form"
import { FC } from "react"
import { UseFieldArrayReturn } from "react-hook-form"
import IngredientSection from "./ingredient-section"
import StepSection from "./step-section"

type RecipeSectionsProps<T extends SectionVariant> = {
  variant: T
  sectionsFieldArray: T extends "ingredient"
    ? UseFieldArrayReturn<
        SectionFieldArray<"ingredient">,
        "ingredients",
        "field_id"
      >
    : UseFieldArrayReturn<SectionFieldArray<"step">, "steps", "field_id">
}

const RecipeSections: FC<RecipeSectionsProps<SectionVariant>> = ({
  variant,
  sectionsFieldArray,
}) => {
  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = sectionsFieldArray

  const onClickAddSection = () => {
    appendSection({ name: "", elements: [] })
  }

  const onClickRemoveSection = (index: number) => {
    removeSection(index)
  }

  const onClickMoveSection = (index: number, up: boolean) => {
    moveFieldArrayElement(sectionsFieldArray, index, up)
  }

  return (
    <div className="space-y-4">
      {sectionFields.map(({ field_id }, index) => {
        return (
          <Card key={`${field_id}-section`}>
            <CardContent className="flex gap-4 flex-col md:flex-row">
              <PositionalButtons
                className="justify-end sm:justify-normal"
                remove={{ index, fn: onClickRemoveSection }}
                move={{ index, fn: onClickMoveSection }}
              />

              <div className="w-full">
                {variant === "ingredient" ? (
                  <IngredientSection sectionIndex={index} />
                ) : (
                  <StepSection sectionIndex={index} />
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
      <Button
        variant="outline"
        className="w-full h-20"
        onClick={onClickAddSection}
      >
        Add Section
      </Button>
    </div>
  )
}

export default RecipeSections
