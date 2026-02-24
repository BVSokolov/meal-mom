import { Metadata } from "next"
import Image from "next/image"
import RecipesPage from "./recipes"

export const metadata: Metadata = {
  title: "Home",
}

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full flex-col items-center justify-between py-10 px-16">
        <RecipesPage />
      </main>
    </div>
  )
}
