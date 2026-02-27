"use client"

import { getFullRecipe } from "@/src/lib/actions/recipe.actions"
import _ from "lodash"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Recipe, RecipeData } from "@/src/types"
import Ingredients from "./ingredients"
import Steps from "./steps"

const convertToRecipeData = (data: Recipe): RecipeData => {
  const {
    id,
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
  return {
    id,
    name,
    public: isPublic,
    servings,
    ingredients,
    steps,
  }
}

const RecipePage = () => {
  const [recipeData, setRecipeData] = useState<RecipeData>()
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    const getRecipeData = async () => {
      const { success, message, data } = await getFullRecipe(id)
      if (success && data) {
        setRecipeData(convertToRecipeData(data))
      }
    }
    getRecipeData()
  }, [id])

  if (!recipeData) return null

  const { name, ingredients, steps } = recipeData

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
