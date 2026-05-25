import type { ReactNode } from "react"

type  ErrorsMessageProps = {
    children: ReactNode
}


export default function ErrorsMessage({children}: ErrorsMessageProps) {
    return (
        <div className="bg-red-50 dark:bg-red-400/10 border border-red-200 dark:border-red-400/30 text-red-600 dark:text-red-400/85 px-3 py-2 text-sm text-center rounded-xl">
            {children}
        </div>
    )
}