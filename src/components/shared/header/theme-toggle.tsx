"use client"
import { Button } from "@/src/components/ui/button"
import { MoonIcon, SunIcon } from "lucide-react"

import { useTheme } from "next-themes"

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const handleClick = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <Button className="float-end" variant="ghost" onClick={handleClick}>
      {theme === "light" ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}

export default ThemeToggle
