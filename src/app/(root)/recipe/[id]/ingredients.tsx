import { RecipeData } from "@/src/types"

const Ingredients = ({ ingredients }: Pick<RecipeData, "ingredients">) => {
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

export default Ingredients
