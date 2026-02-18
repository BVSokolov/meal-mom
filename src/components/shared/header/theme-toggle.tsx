"use client"
import { Button } from "@/src/components/ui/button"
import { MoonIcon, SunIcon } from "lucide-react"

import { useTheme } from "next-themes"

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const handleClick = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button className="float-end" variant="ghost" onClick={handleClick}>
      {theme === "dark" ? <MoonIcon /> : <SunIcon />}
    </Button>
  )
}

export default ThemeToggle
