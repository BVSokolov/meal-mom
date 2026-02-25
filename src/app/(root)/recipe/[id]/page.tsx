import { getFullRecipe } from "@/src/lib/actions/recipe.actions"
import _ from "lodash"
import { Metadata } from "next"
import { FC } from "react"

export const metadata: Metadata = {
  title: "Recipe",
}

const Ingredients = ({ ingredients }) => {
  return (
    <ol>
      {ingredients.map(({ id, name, elements }) => (
        <li key={id}>
          <h3>{name}</h3>
          <ol>
            {elements.map(({ id, ingredient }) => (
              <li key={id}>{ingredient.name}</li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  )
}

const Steps = ({ steps }) => {
  return (
    <ol>
      {steps.map(({ id, name, elements }) => (
        <li key={id}>
          <h3>{name}</h3>
          <ol>
            {elements.map(({ id, text }) => (
              <li key={id}>{text}</li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  )
}

const RecipePage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params
  const { success, message, data } = await getFullRecipe(id)

  if (!data) return null

  const {
    name,
    public: isPublic,
    servings,
    recipeSections,
    recipeIngredients,
    recipeSteps,
  } = data
  const sections = _(recipeSections).keyBy("id").value()
  const ingredients = _(recipeIngredients)
    .groupBy("recipeSectionId")
    .map((sectionIngredients, sectionId) => ({
      ...sections[sectionId],
      elements: sectionIngredients,
    }))
    .orderBy("position")
    .value()
  const steps = _(recipeSteps)
    .groupBy("recipeSectionId")
    .map((sectionSteps, sectionId) => ({
      ...sections[sectionId],
      elements: sectionSteps,
    }))
    .orderBy("position")
    .value()

  console.log("got id ", id, sections, JSON.stringify(ingredients), steps)

  return (
    <>
      <h1 className="h1-bold">{name}</h1>
      {/* show servings */}

      {/*  */}
      <Ingredients ingredients={ingredients} />

      <Steps steps={steps} />
    </>
  )
}

export default RecipePage
