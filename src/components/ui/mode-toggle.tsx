"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/contexts/LanguageContext"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const { t, isClient } = useLanguage()
  const [mounted, setMounted] = React.useState(false)

  // Only show the UI after first render to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Return a simplified version during SSR to avoid hydration mismatches
  if (!mounted || !isClient) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="rounded-full w-9 h-9 border-gray-200 dark:border-gray-800"
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full w-9 h-9 border-gray-200 dark:border-gray-800"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      title={theme === "light" ? t('common.darkMode') : t('common.lightMode')}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">
        {theme === "light" ? t('common.darkMode') : t('common.lightMode')}
      </span>
    </Button>
  )
}
