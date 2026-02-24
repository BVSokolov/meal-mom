import { Button } from "@/src/components/ui/button"
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/src/components/ui/item"
import { getRecipes } from "@/src/lib/actions/recipe.actions"
import Link from "next/link"

const RecipesPage = async () => {
  const recipes = await getRecipes()

  console.log("recipes", recipes)

  return (
    <div className="w-full">
      <div className="flex flex-between mb-6">
        <h1 className="h1-bold">Recipes</h1>
        <Button asChild>
          <Link href="/recipe/new">New Recipe</Link>
        </Button>
      </div>

      <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 md:gap-6 p-6">
        {recipes.map(({ id, name, servings }, _index) => (
          <li key={id}>
            <Item variant="outline">
              <ItemContent>
                <ItemTitle>{name}</ItemTitle>
                <ItemDescription>{servings} servings</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/recipe/${id}`}>Open</Link>
                </Button>
              </ItemActions>
            </Item>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RecipesPage
