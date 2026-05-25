import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, CircleCheck, CircleAlert } from "lucide-react"
import type { MarTreeLinks } from "../types"
import type React from "react"
import { isValidUrl } from "../utils"

type MarTreeInputsProps = {
    item: MarTreeLinks
    handleUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleEnableLinks: (socialNetwork: string) => void
}

export default function MarTreeInputs({ item, handleUrlChange, handleEnableLinks }: MarTreeInputsProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.name })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
    }

    const hasContent = item.url.trim().length > 0
    const urlIsValid = isValidUrl(item.url)
    const showError = hasContent && !urlIsValid
    const showSuccess = hasContent && urlIsValid

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={[
                "bg-white dark:bg-white/[0.04] border rounded-2xl p-4 flex items-center gap-3 transition-all duration-200 shadow-sm dark:shadow-none",
                isDragging
                    ? "border-purple-300 dark:border-purple-500/40 shadow-2xl shadow-purple-500/20 scale-[1.02]"
                    : "border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.12]",
            ].join(" ")}
        >
            {/* Drag handle */}
            <button
                type="button"
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-white/[0.18] hover:text-slate-400 dark:hover:text-white/40 transition-colors flex-shrink-0 touch-none p-0.5"
                aria-label="Arrastrar para reordenar"
            >
                <GripVertical className="w-4 h-4" />
            </button>

            {/* Network icon */}
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img
                    src={`/social/icon_${item.name}.svg`}
                    alt={item.name}
                    className="w-11 h-11 object-contain"
                    style={item.name === 'github' ? { filter: 'invert(1) brightness(1.4)' } : undefined}
                />
            </div>

            {/* Input area */}
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-slate-400 dark:text-white/35 uppercase tracking-widest mb-1.5">
                    {item.name}
                </p>
                <div className="relative">
                    <input
                        type="text"
                        id={item.name}
                        placeholder="https://"
                        className={[
                            "w-full h-10 rounded-xl px-3 pr-8 text-sm",
                            "bg-slate-50 dark:bg-white/[0.05] border",
                            "text-slate-800 dark:text-white/90 placeholder-slate-400 dark:placeholder-white/20",
                            "outline-none transition-all duration-200",
                            showError
                                ? "border-red-400/60 focus:border-red-500 focus:ring-1 focus:ring-red-400/20"
                                : showSuccess
                                    ? "border-green-500/50 focus:border-green-500 focus:ring-1 focus:ring-green-400/20"
                                    : "border-slate-200 dark:border-white/[0.08] focus:border-purple-400 dark:focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/20 dark:focus:ring-purple-400/15",
                        ].join(" ")}
                        value={item.url}
                        onChange={handleUrlChange}
                        name={item.name}
                    />
                    {showError && <CircleAlert className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500/70 pointer-events-none" />}
                    {showSuccess && <CircleCheck className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500/70 pointer-events-none" />}
                </div>
                {showError && (
                    <p className="mt-1 text-[11px] text-red-500/80">URL inválida — ej: https://sitio.com</p>
                )}
            </div>

            {/* Toggle */}
            <label
                className="relative inline-flex cursor-pointer items-center flex-shrink-0"
                aria-label={`${item.enabled ? 'Desactivar' : 'Activar'} ${item.name}`}
            >
                <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={item.enabled}
                    onChange={() => handleEnableLinks(item.name)}
                    aria-checked={item.enabled}
                />
                <div className="
                    h-7 w-14 rounded-full border border-slate-300 dark:border-white/15 bg-slate-200 dark:bg-white/[0.07]
                    relative transition-all duration-300
                    after:absolute after:left-[3px] after:top-[3px]
                    after:h-[22px] after:w-[22px] after:rounded-full
                    after:bg-white after:shadow-sm after:transition-transform after:duration-300
                    peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-teal-500
                    peer-checked:border-transparent peer-checked:after:translate-x-7 peer-checked:after:bg-white
                " />
            </label>
        </div>
    )
}
