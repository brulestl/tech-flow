"use client"

import * as React from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  attribute?: string
  enableSystem?: boolean
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

export const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  attribute = "data-theme",
  enableSystem = true,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme)

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    
    const root = window.document.documentElement

    const removeAttribute = () => {
      root.removeAttribute(attribute)
    }

    const setAttr = (attr: string) => {
      root.setAttribute(attribute, attr)
    }

    if (theme === "system" && enableSystem) {
      const media = window.matchMedia("(prefers-color-scheme: dark)")
      const listener = () => {
        const isDark = media.matches
        setAttr(isDark ? "dark" : "light")
      }

      listener()
      media.addEventListener("change", listener)
      return () => {
        media.removeEventListener("change", listener)
        removeAttribute()
      }
    }

    if (theme === "dark") {
      setAttr("dark")
      return removeAttribute
    }

    if (theme === "light") {
      setAttr("light")
      return removeAttribute
    }

    return undefined
  }, [theme, attribute, enableSystem])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme]
  )

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
