import { getFullRecipe } from "@/src/lib/actions/recipe.actions"

const RecipePage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params
  const data = await getFullRecipe(id)

  console.log("got id ", id)

  return <>{JSON.stringify(data)}</>
}

export default RecipePage
