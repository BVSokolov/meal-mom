import CustomFormItem from "@/src/components/shared/form/custom-form-item"
import PositionalButtons from "@/src/components/shared/form/positional-buttons"
import { SectionLayout } from "@/src/components/shared/form/recipe-section-layout"
import { Button } from "@/src/components/ui/button"
import { FormField } from "@/src/components/ui/form"

import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { moveFieldArrayElement } from "@/src/lib/utils"
import { NewRecipeFormData, SectionFieldArray } from "@/src/types/form"
import { useFieldArray, useFormContext } from "react-hook-form"

const StepSection = ({ sectionIndex }: { sectionIndex: number }) => {
  const NAME_KEY = `steps.${sectionIndex}.name` as const
  const ELEMENTS_KEY = `steps.${sectionIndex}.elements` as const

  const { control } = useFormContext<NewRecipeFormData>()

  const sectionElementsFieldArray = useFieldArray<
    SectionFieldArray<"step">,
    `steps.${number}.elements`,
    "field_id"
  >({
    name: `steps.${sectionIndex}.elements`,
    keyName: "field_id",
  })

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = sectionElementsFieldArray

  const onClickAddStep = () => {
    appendStep({ text: "" })
  }

  const onClickRemoveStep = (index: number) => {
    removeStep(index)
  }

  const onClickMoveStep = (index: number, up: boolean) => {
    moveFieldArrayElement(sectionElementsFieldArray, index, up)
  }

  return (
    <div>
      <SectionLayout.SectionHeader>
        {/* SECTION NAME */}
        <FormField
          control={control}
          name={NAME_KEY}
          render={({ field, fieldState }) => (
            <CustomFormItem fieldState={fieldState}>
              <Input placeholder="Enter section name" {...field} />
            </CustomFormItem>
          )}
        />
      </SectionLayout.SectionHeader>
      <SectionLayout.SectionContent>
        {stepFields.map(({ field_id }, index) => (
          <div className="flex flex-col gap-4" key={`${field_id}-step`}>
            <SectionLayout.SectionEntry index={index}>
              <PositionalButtons
                className="justify-end sm:justify-normal"
                remove={{ index, fn: onClickRemoveStep }}
                move={{ index, fn: onClickMoveStep }}
              />

              <SectionLayout.EntryFieldsRow>
                {/* STEP TEXT */}
                {`${index + 1}.`}
                <FormField
                  control={control}
                  name={`${ELEMENTS_KEY}.${index}.text`}
                  render={({ field, fieldState }) => (
                    <CustomFormItem fieldState={fieldState}>
                      <Textarea placeholder="Enter step" {...field} />
                    </CustomFormItem>
                  )}
                />
              </SectionLayout.EntryFieldsRow>
            </SectionLayout.SectionEntry>
          </div>
        ))}
        <Button
          variant="secondary"
          className="self-center w-full h-20"
          onClick={onClickAddStep}
        >
          Add Step
        </Button>
      </SectionLayout.SectionContent>
    </div>
  )
}

export default StepSection
