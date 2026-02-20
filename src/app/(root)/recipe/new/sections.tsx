import CustomFormItem from "@/src/components/shared/form/custom-form-item"
import { Button } from "@/src/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form"
import { Input } from "@/src/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select"
import { QuantityUOM } from "@/src/lib/generated/prisma/enums"
import { moveFieldArrayElement } from "@/src/lib/utils"
import {
  insertRecipeIngredientFormDataSchema,
  insertRecipeStepFormDataSchema,
} from "@/src/lib/validators"
import { NewRecipeFormData } from "@/src/types/formData"
import {
  useFieldArray,
  UseFieldArrayReturn,
  useFormContext,
} from "react-hook-form"
import z from "zod"

export type SectionVariant = "ingredient" | "step"

type IngredientFormData = z.infer<typeof insertRecipeIngredientFormDataSchema>
type StepFormData = z.infer<typeof insertRecipeStepFormDataSchema>

type SectionFormData<T extends SectionVariant> = {
  name: string
  elements: Array<T extends "ingredient" ? IngredientFormData : StepFormData>
}

type SectionFieldArray<T extends SectionVariant> = Partial<
  T extends "ingredient"
    ? {
        ingredients: Array<SectionFormData<"ingredient">>
      }
    : {
        steps: Array<SectionFormData<"step">>
      }
>

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
    <div className="ml-4 space-y-2">
      <div>
        {/* SECTION NAME */}
        <FormField
          control={control}
          name={NAME_KEY}
          render={({ field }) => (
            <CustomFormItem>
              <Input placeholder="Enter section name" {...field} />
            </CustomFormItem>
          )}
        />
      </div>
      {ingredientFields.map(({ field_id }, index) => (
        <div className="flex gap-1 items-end" key={`${field_id}-ingredient`}>
          <Button
            variant="destructive"
            onClick={() => onClickRemoveIngredient(index)}
          >
            Remove
          </Button>
          <Button onClick={() => onClickMoveIngredient(index, true)}>
            Move Up
          </Button>
          <Button onClick={() => onClickMoveIngredient(index, false)}>
            Move Down
          </Button>

          {/* INGREDIENT NAME */}
          <FormField
            control={control}
            name={`${ELEMENTS_KEY}.${index}.name`}
            render={({ field }) => (
              <CustomFormItem label="Name">
                <Input placeholder="Enter ingredient name" {...field} />
              </CustomFormItem>
            )}
          />

          {/* INGREDIENT AMOUNT */}
          <FormField
            control={control}
            name={`${ELEMENTS_KEY}.${index}.amount`}
            render={({ field }) => (
              <CustomFormItem label="Amount">
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
        </div>
      ))}
      <Button onClick={onClickAddIngredient}>Add Ingredient</Button>
    </div>
  )
}

const RecipeSections = ({
  variant,
  sectionsFieldArray,
}: {
  variant: SectionVariant
  sectionsFieldArray: UseFieldArrayReturn<
    Partial<{ ingredients: NewRecipeFormData["ingredients"] }>,
    "ingredients",
    "field_id"
  >
}) => {
  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = sectionsFieldArray

  const onClickAddSection = () => {
    // // @ts-expect-error TODO: i don't know how to fix this and i've ran out of fucks to give
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
          <div className="space-x-2 space-y-2" key={`${field_id}-section`}>
            <Button
              variant="destructive"
              onClick={() => onClickRemoveSection(index)}
            >
              Remove
            </Button>
            <Button onClick={() => onClickMoveSection(index, true)}>
              Move Up
            </Button>
            <Button onClick={() => onClickMoveSection(index, false)}>
              Move Down
            </Button>
            {variant === "ingredient" ? (
              <IngredientSection sectionIndex={index} />
            ) : null}
          </div>
        )
      })}
      <div>
        <Button onClick={onClickAddSection}>Add Section</Button>
      </div>
    </div>
  )
}

export default RecipeSections
