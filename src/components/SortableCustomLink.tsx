import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, CircleCheck, CircleX, Trash2, Pencil, Check, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { CustomLink } from "../types"
import CustomLinkIconRenderer from "./CustomLinkIconRenderer"
import { CUSTOM_LINK_ICONS, DEFAULT_ICON } from "../data/customLinkIcons"

type Props = {
    link: CustomLink
    index: number
    isEditing: boolean
    onToggle: (id: string) => void
    onDelete: (id: string) => void
    onStartEdit: (id: string) => void
    onSaveEdit: (id: string, data: { emoji: string; title: string; url: string }) => void
    onCancelEdit: () => void
}

export default function SortableCustomLink({
    link, index, isEditing,
    onToggle, onDelete, onStartEdit, onSaveEdit, onCancelEdit,
}: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: link.id })

    const dndStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
    }

    const [localForm, setLocalForm] = useState({ emoji: link.emoji || DEFAULT_ICON, title: link.title, url: link.url })
    const [showIconPicker, setShowIconPicker] = useState(false)

    const handleStartEdit = () => {
        setLocalForm({ emoji: link.emoji || DEFAULT_ICON, title: link.title, url: link.url })
        setShowIconPicker(false)
        onStartEdit(link.id)
    }

    const handleSave = () => {
        if (!localForm.title.trim() || !localForm.url.trim()) return
        onSaveEdit(link.id, { emoji: localForm.emoji, title: localForm.title.trim(), url: localForm.url.trim() })
    }

    const handleCancel = () => {
        setShowIconPicker(false)
        onCancelEdit()
    }

    return (
        <motion.div
            ref={setNodeRef}
            style={dndStyle}
            {...attributes}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16, transition: { duration: 0.18 } }}
            transition={{ delay: index * 0.04, type: "spring", stiffness: 260, damping: 22 }}
            className={[
                "rounded-2xl bg-white dark:bg-white/[0.04] border transition-all",
                isEditing
                    ? "border-purple-300 dark:border-purple-500/40 shadow-lg shadow-purple-500/10 p-4"
                    : [
                        "flex items-center gap-3 p-3.5",
                        link.enabled
                            ? "border-slate-200 dark:border-white/[0.08]"
                            : "border-slate-100 dark:border-white/[0.04] opacity-50",
                        isDragging
                            ? "shadow-2xl shadow-purple-500/20 scale-[1.02] border-purple-300 dark:border-purple-500/30"
                            : "",
                    ].join(" "),
            ].join(" ")}
        >
            {isEditing ? (
                /* ── Edit mode ── */
                <div className="flex flex-col gap-3">
                    <p className="text-[10px] font-semibold text-purple-400 dark:text-purple-400/80 uppercase tracking-widest">
                        Editando enlace
                    </p>

                    {/* Icon + Title */}
                    <div className="flex gap-2">
                        {/* Icon picker trigger */}
                        <div className="relative flex-shrink-0">
                            {(() => {
                                const def = CUSTOM_LINK_ICONS.find(i => i.id === localForm.emoji)
                                return (
                                    <button
                                        type="button"
                                        onClick={() => setShowIconPicker(v => !v)}
                                        className="w-11 h-11 rounded-xl border flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-150"
                                        style={{
                                            background: def ? `${def.color}22` : "rgba(148,163,184,0.12)",
                                            borderColor: showIconPicker ? (def?.color ?? "#94a3b8") : "rgba(148,163,184,0.3)",
                                            boxShadow: showIconPicker ? `0 0 0 2px ${def?.color ?? "#94a3b8"}44` : undefined,
                                        }}
                                    >
                                        <CustomLinkIconRenderer
                                            value={localForm.emoji}
                                            size={18}
                                            color={def?.color ?? "#94a3b8"}
                                        />
                                    </button>
                                )
                            })()}

                            <AnimatePresence>
                                {showIconPicker && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.92, y: -4 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.92, y: -4 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-13 left-0 z-40 bg-white dark:bg-[#0f0f26] border border-slate-200 dark:border-white/10 rounded-2xl p-3 shadow-2xl w-[228px]"
                                    >
                                        <p className="text-[10px] font-semibold text-slate-400 dark:text-white/30 uppercase tracking-widest mb-2.5 px-0.5">
                                            Elegir ícono
                                        </p>
                                        <div className="grid grid-cols-6 gap-1.5">
                                            {CUSTOM_LINK_ICONS.map(iconDef => {
                                                const isSelected = localForm.emoji === iconDef.id
                                                return (
                                                    <button
                                                        key={iconDef.id}
                                                        type="button"
                                                        title={iconDef.label}
                                                        onClick={() => {
                                                            setLocalForm(f => ({ ...f, emoji: iconDef.id }))
                                                            setShowIconPicker(false)
                                                        }}
                                                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 hover:scale-110"
                                                        style={{
                                                            background: isSelected ? `${iconDef.color}30` : "transparent",
                                                            boxShadow: isSelected ? `0 0 0 1.5px ${iconDef.color}80` : undefined,
                                                        }}
                                                    >
                                                        <iconDef.icon
                                                            width={16}
                                                            height={16}
                                                            strokeWidth={isSelected ? 2.2 : 1.8}
                                                            style={{ color: iconDef.color }}
                                                        />
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <input
                            type="text"
                            placeholder="Título del enlace"
                            value={localForm.title}
                            onChange={e => setLocalForm(f => ({ ...f, title: e.target.value }))}
                            autoFocus
                            className="flex-1 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.09] text-slate-800 dark:text-white/90 placeholder-slate-400 dark:placeholder-white/20 text-sm font-medium focus:outline-none focus:border-purple-400 dark:focus:border-purple-400/50 transition-colors"
                        />
                    </div>

                    {/* URL */}
                    <input
                        type="url"
                        placeholder="https://ejemplo.com"
                        value={localForm.url}
                        onChange={e => setLocalForm(f => ({ ...f, url: e.target.value }))}
                        onKeyDown={e => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") handleCancel() }}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.09] text-slate-800 dark:text-white/90 placeholder-slate-400 dark:placeholder-white/20 text-sm focus:outline-none focus:border-teal-400 dark:focus:border-teal-400/50 transition-colors"
                    />

                    {/* Save / Cancel */}
                    <div className="flex gap-2 justify-end">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-white/40 text-sm font-medium hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={!localForm.title.trim() || !localForm.url.trim()}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-teal-500 text-white text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-purple-500/20"
                        >
                            <Check className="w-3.5 h-3.5" />
                            Guardar
                        </button>
                    </div>
                </div>
            ) : (
                /* ── View mode ── */
                <>
                    {/* Drag handle */}
                    <button
                        type="button"
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-white/[0.18] hover:text-slate-400 dark:hover:text-white/40 transition-colors flex-shrink-0 touch-none p-0.5"
                        aria-label="Arrastrar para reordenar"
                    >
                        <GripVertical className="w-4 h-4" />
                    </button>

                    {/* Icon */}
                    {(() => {
                        const def = CUSTOM_LINK_ICONS.find(i => i.id === link.emoji)
                        return (
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 select-none"
                                style={{ background: def ? `${def.color}20` : "rgba(148,163,184,0.1)" }}
                            >
                                <CustomLinkIconRenderer
                                    value={link.emoji}
                                    size={18}
                                    color={def?.color ?? "#94a3b8"}
                                />
                            </div>
                        )
                    })()}

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-white/90 leading-none mb-0.5">
                            {link.title}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-white/30 truncate">
                            {link.url}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                            type="button"
                            onClick={handleStartEdit}
                            className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/[0.05] text-slate-400 dark:text-white/30 flex items-center justify-center hover:bg-purple-100 dark:hover:bg-purple-400/15 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
                            title="Editar"
                        >
                            <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                        </button>

                        <button
                            type="button"
                            onClick={() => onToggle(link.id)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                link.enabled
                                    ? "bg-teal-100 dark:bg-teal-400/15 text-teal-600 dark:text-teal-400"
                                    : "bg-slate-100 dark:bg-white/[0.05] text-slate-400 dark:text-white/25"
                            }`}
                            title={link.enabled ? "Desactivar" : "Activar"}
                        >
                            {link.enabled
                                ? <CircleCheck className="w-3.5 h-3.5" strokeWidth={2} />
                                : <CircleX className="w-3.5 h-3.5" strokeWidth={2} />
                            }
                        </button>

                        <button
                            type="button"
                            onClick={() => onDelete(link.id)}
                            className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-400/10 text-red-400 dark:text-red-400/70 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-400/20 transition-colors"
                            title="Eliminar"
                        >
                            <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                        </button>
                    </div>
                </>
            )}
        </motion.div>
    )
}
