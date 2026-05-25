import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import { updateProfile } from "../api/MarTreeApi"
import { isValidUrl } from "../utils"
import type { CustomLink, User } from "../types"
import SortableCustomLink from "../components/SortableCustomLink"
import CustomLinkIconRenderer from "../components/CustomLinkIconRenderer"
import { CUSTOM_LINK_ICONS, DEFAULT_ICON } from "../data/customLinkIcons"

export default function CustomLinksView() {
    const queryClient = useQueryClient()
    const user = queryClient.getQueryData<User>(["user"])

    const [links, setLinks] = useState<CustomLink[]>(() => {
        if (!user?.customLinks) return []
        try { return JSON.parse(user.customLinks) } catch { return [] }
    })

    const [form, setForm] = useState({ emoji: DEFAULT_ICON, title: "", url: "" })
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    useEffect(() => {
        if (user?.customLinks) {
            try { setLinks(JSON.parse(user.customLinks)) } catch {}
        }
    }, [user?.customLinks])

    const { mutate, isPending } = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => toast.success("Links personalizados guardados"),
        onError: (err: Error) => toast.error(err.message),
    })

    const handleAdd = () => {
        if (!form.title.trim()) { toast.error("El título es obligatorio"); return }
        if (!form.url.trim() || !isValidUrl(form.url.trim())) { toast.error("Ingresa una URL válida"); return }

        const newLink: CustomLink = {
            id: crypto.randomUUID(),
            emoji: form.emoji || DEFAULT_ICON,
            title: form.title.trim(),
            url: form.url.trim(),
            enabled: true,
        }
        setLinks(prev => [...prev, newLink])
        setForm({ emoji: DEFAULT_ICON, title: "", url: "" })
    }

    const handleDelete = (id: string) => setLinks(prev => prev.filter(l => l.id !== id))

    const handleToggle = (id: string) =>
        setLinks(prev => prev.map(l => l.id === id ? { ...l, enabled: !l.enabled } : l))

    const handleStartEdit = (id: string) => setEditingId(id)
    const handleCancelEdit = () => setEditingId(null)
    const handleSaveEdit = (id: string, data: { emoji: string; title: string; url: string }) => {
        if (!isValidUrl(data.url)) { toast.error("Ingresa una URL válida"); return }
        setLinks(prev => prev.map(l => l.id === id ? { ...l, ...data } : l))
        setEditingId(null)
    }

    const handleSave = () => {
        if (!user) return
        const updated = { ...user, customLinks: JSON.stringify(links) }
        queryClient.setQueryData(["user"], updated)
        mutate(updated)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return
        const oldIndex = links.findIndex(l => l.id === active.id)
        const newIndex = links.findIndex(l => l.id === over.id)
        if (oldIndex === -1 || newIndex === -1) return
        const reordered = arrayMove(links, oldIndex, newIndex)
        setLinks(reordered)
        if (!user) return
        const updated = { ...user, customLinks: JSON.stringify(reordered) }
        queryClient.setQueryData(["user"], updated)
        mutate(updated)
    }

    return (
        <div className="flex flex-col gap-6">

            {/* ── Add new link form ── */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.07] p-5"
            >
                <p className="text-sm font-semibold text-slate-500 dark:text-white/40 uppercase tracking-wider mb-4">
                    Nuevo enlace
                </p>

                <div className="flex flex-col gap-3">
                    {/* Icon + Title row */}
                    <div className="flex gap-2">
                        {/* Icon picker trigger */}
                        <div className="relative flex-shrink-0">
                            {(() => {
                                const def = CUSTOM_LINK_ICONS.find(i => i.id === form.emoji)
                                return (
                                    <button
                                        type="button"
                                        onClick={() => setShowEmojiPicker(v => !v)}
                                        className="w-12 h-12 rounded-xl border border-slate-200 dark:border-white/[0.08] flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-150 flex-shrink-0"
                                        style={{
                                            background: def ? `${def.color}22` : "rgba(148,163,184,0.12)",
                                            borderColor: showEmojiPicker ? (def?.color ?? "#94a3b8") : undefined,
                                            boxShadow: showEmojiPicker ? `0 0 0 2px ${def?.color ?? "#94a3b8"}44` : undefined,
                                        }}
                                    >
                                        <CustomLinkIconRenderer
                                            value={form.emoji}
                                            size={20}
                                            color={def?.color ?? "#94a3b8"}
                                        />
                                    </button>
                                )
                            })()}

                            <AnimatePresence>
                                {showEmojiPicker && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.92, y: -4 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.92, y: -4 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-14 left-0 z-30 bg-white dark:bg-[#0f0f26] border border-slate-200 dark:border-white/10 rounded-2xl p-3 shadow-2xl w-[228px]"
                                    >
                                        <p className="text-[10px] font-semibold text-slate-400 dark:text-white/30 uppercase tracking-widest mb-2.5 px-0.5">
                                            Elegir ícono
                                        </p>
                                        <div className="grid grid-cols-6 gap-1.5">
                                            {CUSTOM_LINK_ICONS.map(iconDef => {
                                                const isSelected = form.emoji === iconDef.id
                                                return (
                                                    <button
                                                        key={iconDef.id}
                                                        type="button"
                                                        title={iconDef.label}
                                                        onClick={() => {
                                                            setForm(f => ({ ...f, emoji: iconDef.id }))
                                                            setShowEmojiPicker(false)
                                                        }}
                                                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 hover:scale-110"
                                                        style={{
                                                            background: isSelected
                                                                ? `${iconDef.color}30`
                                                                : "transparent",
                                                            boxShadow: isSelected
                                                                ? `0 0 0 1.5px ${iconDef.color}80`
                                                                : undefined,
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

                        {/* Title */}
                        <input
                            type="text"
                            placeholder="Título del enlace"
                            value={form.title}
                            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                            className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.09] text-slate-800 dark:text-white/90 placeholder-slate-400 dark:placeholder-white/20 text-sm font-medium focus:outline-none focus:border-purple-400 dark:focus:border-purple-400/50 transition-colors"
                        />
                    </div>

                    {/* URL row */}
                    <div className="flex gap-2">
                        <input
                            type="url"
                            placeholder="https://ejemplo.com"
                            value={form.url}
                            onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                            onKeyDown={e => e.key === "Enter" && handleAdd()}
                            className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.09] text-slate-800 dark:text-white/90 placeholder-slate-400 dark:placeholder-white/20 text-sm focus:outline-none focus:border-teal-400 dark:focus:border-teal-400/50 transition-colors"
                        />
                        <button
                            type="button"
                            onClick={handleAdd}
                            className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-purple-600 text-white text-sm font-bold hover:scale-[1.03] active:scale-[0.98] transition-transform shadow-md shadow-purple-500/20 flex-shrink-0"
                        >
                            Agregar
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* ── Links list ── */}
            <div className="flex flex-col gap-2">
                {links.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-2xl border border-dashed border-slate-300 dark:border-white/[0.08] p-10 text-center"
                    >
                        <p className="text-3xl mb-2">🔗</p>
                        <p className="text-sm text-slate-400 dark:text-white/30 italic">
                            Aún no tienes enlaces personalizados
                        </p>
                    </motion.div>
                ) : (
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
                            <AnimatePresence initial={false}>
                                {links.map((link, i) => (
                                    <SortableCustomLink
                                        key={link.id}
                                        link={link}
                                        index={i}
                                        isEditing={editingId === link.id}
                                        onToggle={handleToggle}
                                        onDelete={handleDelete}
                                        onStartEdit={handleStartEdit}
                                        onSaveEdit={handleSaveEdit}
                                        onCancelEdit={handleCancelEdit}
                                    />
                                ))}
                            </AnimatePresence>
                        </SortableContext>
                    </DndContext>
                )}
            </div>

            {/* ── Save button ── */}
            {links.length > 0 && (
                <motion.button
                    type="button"
                    onClick={handleSave}
                    disabled={isPending}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-teal-500 text-white shadow-lg shadow-purple-600/20 hover:shadow-purple-600/35 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Guardando...
                        </span>
                    ) : "Guardar Links"}
                </motion.button>
            )}
        </div>
    )
}
