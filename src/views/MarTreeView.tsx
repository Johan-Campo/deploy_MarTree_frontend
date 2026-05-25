import { useEffect, useMemo, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import { social } from "../data/social"
import MarTreeInputs from "../components/MarTreeInputs"
import { isValidUrl } from "../utils"
import { toast } from "sonner"
import { updateProfile } from "../api/MarTreeApi"
import type { MarTreeLinks, SocialNetwork, User } from "../types"

export default function MarTreeView() {
    const queryClient = useQueryClient()
    const user = queryClient.getQueryData<User>(["user"])

    const [MarTreeLinks, setMarTreeLinks] = useState<MarTreeLinks[]>(() => social)

    const { mutate, isPending } = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => toast.success("Enlaces actualizados correctamente"),
        onError: (error) => toast.error(`Error al actualizar el perfil: ${error}`),
    })

    const baseLinks = useMemo(() => {
        if (!user?.links) return social

        const parsedLinks: SocialNetwork[] = JSON.parse(user.links)

        // Respect saved order, then append unsaved networks at the end
        const savedNames = new Set(parsedLinks.map(l => l.name))
        const ordered = parsedLinks
            .map(saved => {
                const def = social.find(s => s.name === saved.name)
                return def ? { ...def, url: saved.url, enabled: saved.enabled } : null
            })
            .filter(Boolean) as MarTreeLinks[]

        const unsaved = social.filter(s => !savedNames.has(s.name))
        return [...ordered, ...unsaved]
    }, [user?.links])

    useEffect(() => {
        setMarTreeLinks(baseLinks)
    }, [baseLinks])

    if (!user) return null

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMarTreeLinks(prev =>
            prev.map(link => link.name === e.target.name ? { ...link, url: e.target.value } : link)
        )
    }

    const handleEnableLinks = (socialNetwork: string) => {
        const updated = MarTreeLinks.map(link => {
            if (link.name !== socialNetwork) return link
            if (!link.enabled && !isValidUrl(link.url)) {
                toast.error("Por favor ingresa una URL válida")
                return link
            }
            return { ...link, enabled: !link.enabled }
        })
        setMarTreeLinks(updated)
    }

    // Build SocialNetwork[] payload from current local state (preserves ids)
    const buildPayload = (links: MarTreeLinks[]): User => {
        const currentLinks: SocialNetwork[] = user.links ? JSON.parse(user.links) : []
        const merged: SocialNetwork[] = links.map(ml => {
            const existing = currentLinks.find(l => l.name === ml.name)
            return existing
                ? { ...existing, url: ml.url, enabled: ml.enabled }
                : { id: crypto.randomUUID(), name: ml.name, url: ml.url, enabled: ml.enabled }
        })
        return { ...user, links: JSON.stringify(merged) }
    }

    const handleSave = () => {
        const payload = buildPayload(MarTreeLinks)
        queryClient.setQueryData(["user"], payload)
        mutate(payload)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return
        const oldIndex = MarTreeLinks.findIndex(l => l.name === active.id)
        const newIndex = MarTreeLinks.findIndex(l => l.name === over.id)
        if (oldIndex === -1 || newIndex === -1) return
        const reordered = arrayMove(MarTreeLinks, oldIndex, newIndex)
        setMarTreeLinks(reordered)
        const payload = buildPayload(reordered)
        queryClient.setQueryData(["user"], payload)
        mutate(payload)
    }

    return (
        <div className="space-y-5">
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={MarTreeLinks.map(l => l.name)} strategy={verticalListSortingStrategy}>
                    {MarTreeLinks.map(item => (
                        <MarTreeInputs
                            key={item.name}
                            item={item}
                            handleUrlChange={handleUrlChange}
                            handleEnableLinks={handleEnableLinks}
                        />
                    ))}
                </SortableContext>
            </DndContext>

            <button
                type="button"
                disabled={isPending}
                onClick={handleSave}
                className="
                    w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider
                    bg-gradient-to-r from-purple-600 to-teal-500 text-white
                    shadow-lg shadow-purple-600/20
                    hover:shadow-purple-600/35 hover:scale-[1.01]
                    active:scale-[0.99] transition-all duration-200
                    focus:outline-none
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none
                "
            >
                {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                        Guardando...
                    </span>
                ) : "Guardar Cambios"}
            </button>
        </div>
    )
}
