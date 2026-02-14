import type { ReactNode } from "react"

type  errorsMessageProps = {
    children: ReactNode
}


export default function ErrorsMessage({children}: errorsMessageProps) {
    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 text-center rounded-lg mb-2">
            {children}
        </div>
    )
}