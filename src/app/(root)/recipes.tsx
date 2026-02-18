import { Button } from "@/src/components/ui/button"
import { getRecipes } from "@/src/lib/actions/recipe.actions"
import Link from "next/link"

const RecipesPage = async () => {
  const recipes = await getRecipes()

  console.log("recipes", recipes)

  return (
    <div className="w-full">
      <div className="flex flex-between ">
        <h1 className="h1-bold">Recipes</h1>
        <Button asChild>
          <Link href="/recipe/new">New Recipe</Link>
        </Button>
      </div>

      <ul>
        {recipes.map((recipe, index) => (
          <li key={index}>{JSON.stringify(recipe)}</li>
        ))}
      </ul>
    </div>
  )
}

export default RecipesPage
