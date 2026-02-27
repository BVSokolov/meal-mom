import { RecipeData } from "@/src/types"

const Steps = ({ steps }: Pick<RecipeData, "steps">) => {
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

export default Steps
