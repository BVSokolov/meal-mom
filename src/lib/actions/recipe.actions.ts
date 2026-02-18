import { auth } from "@/src/auth"
import { prisma } from "@/src/db/prisma-client"
import { convertToPlainObject } from "../utils"

export async function getRecipes() {
  const session = await auth()
  const userId = session?.user.id

  const recipes = await prisma.recipe.findMany({
    where: {
      OR: [{ public: true }, { userId }],
    },
    orderBy: { name: "asc" },
  })

  return convertToPlainObject(recipes)
}
