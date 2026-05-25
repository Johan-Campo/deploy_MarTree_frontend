import { useEffect } from "react"

export function useForceDark() {
    useEffect(() => {
        document.documentElement.classList.add("dark")
        return () => {
            const saved = localStorage.getItem("theme")
            if (saved !== "dark") document.documentElement.classList.remove("dark")
        }
    }, [])
}
