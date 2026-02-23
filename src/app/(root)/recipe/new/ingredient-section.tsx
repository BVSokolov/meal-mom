import CustomFormItem from "@/src/components/shared/form/custom-form-item"
import PositionalButtons from "@/src/components/shared/form/positional-buttons"
import { SectionLayout } from "@/src/components/shared/form/recipe-section-layout"
import { Button } from "@/src/components/ui/button"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/src/components/ui/form"
import { Input } from "@/src/components/ui/input"
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select"
import { QuantityUOM } from "@/src/lib/generated/prisma/enums"
import { moveFieldArrayElement } from "@/src/lib/utils"
import {
  IngredientFormData,
  NewRecipeFormData,
  SectionFieldArray,
} from "@/src/types/form"
import { Select } from "@/src/components/ui/select"
import { useFormContext, useFieldArray } from "react-hook-form"

const getDefaultIngredientValues = (): IngredientFormData => ({
  name: "",
  amount: 0,
  amountUOM: QuantityUOM.ITEM,
  // refId: null,
})

const IngredientSection = ({ sectionIndex }: { sectionIndex: number }) => {
  const NAME_KEY = `ingredients.${sectionIndex}.name` as const
  const ELEMENTS_KEY = `ingredients.${sectionIndex}.elements` as const

  const { control } = useFormContext<NewRecipeFormData>()

  const sectionElementsFieldArray = useFieldArray<
    SectionFieldArray<"ingredient">,
    `ingredients.${number}.elements`,
    "field_id"
  >({
    name: `ingredients.${sectionIndex}.elements`,
    keyName: "field_id",
  })
  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = sectionElementsFieldArray

  const onClickAddIngredient = () => {
    appendIngredient(getDefaultIngredientValues())
  }

  const onClickRemoveIngredient = (index: number) => {
    removeIngredient(index)
  }

  const onClickMoveIngredient = (index: number, up: boolean) => {
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
            <CustomFormItem fieldState={fieldState} noError>
              <Input placeholder="Enter section name" {...field} />
            </CustomFormItem>
          )}
        />
      </SectionLayout.SectionHeader>
      <SectionLayout.SectionContent>
        {ingredientFields.map(({ field_id }, index) => (
          <div key={`${field_id}-ingredient`}>
            <SectionLayout.SectionEntry index={index}>
              <div className="flex flex-col sm:flex-row gap-4 items-start mt-4 sm:mt-6">
                <PositionalButtons
                  className="sm:mt-8.5 md:mt-7 justify-end"
                  remove={{ index, fn: onClickRemoveIngredient }}
                  move={{ index, fn: onClickMoveIngredient }}
                />

                <SectionLayout.EntryFieldsRow>
                  {/* INGREDIENT NAME */}
                  <FormField
                    control={control}
                    name={`${ELEMENTS_KEY}.${index}.name`}
                    render={({ field, fieldState }) => (
                      <CustomFormItem
                        fieldState={fieldState}
                        className="flex-4"
                        label="Name"
                      >
                        <Input placeholder="Enter ingredient name" {...field} />
                      </CustomFormItem>
                    )}
                  />

                  {/* INGREDIENT AMOUNT */}
                  <FormField
                    control={control}
                    name={`${ELEMENTS_KEY}.${index}.amount`}
                    render={({ field, fieldState }) => (
                      <CustomFormItem
                        fieldState={fieldState}
                        label="Amount"
                        className="flex-2"
                      >
                        <Input placeholder="Enter amount" {...field} />
                      </CustomFormItem>
                    )}
                  />

                  {/* INGREDIENT AMOUNT UOM */}
                  <FormField
                    control={control}
                    name={`${ELEMENTS_KEY}.${index}.amountUOM`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UOM</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(QuantityUOM).map((uom, index) => (
                              <SelectItem key={uom} value={uom}>
                                {uom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </SectionLayout.EntryFieldsRow>
              </div>
            </SectionLayout.SectionEntry>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          className="self-center w-full h-20"
          onClick={onClickAddIngredient}
        >
          Add Ingredient
        </Button>
      </SectionLayout.SectionContent>
    </div>
  )
}

export default IngredientSection
