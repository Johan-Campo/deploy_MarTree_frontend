import NavigationTabs from "./NavigationTabs"
import { useQueryClient } from "@tanstack/react-query";
import { Link, Outlet } from "react-router-dom";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import SortableLink from "./SortableLinks";
import { Toaster } from "sonner";
import type { SocialNetwork, User } from "../types";
import { motion } from "framer-motion";
import { arrayMove } from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";
import Header from "./Header";




type MartTreeProps = {
    data: User
}

export default function MartTree({ data }: MartTreeProps) {

    const queryClient = useQueryClient();

    const [isDragging, setIsDragging] = useState(false);

    const orderedLinks = useMemo<SocialNetwork[]>(() => {
        if (!data.links) return [];

        try {
            const parsed: SocialNetwork[] = JSON.parse(data.links);
            return parsed.filter(link => link.enabled);
        } catch {
            return [];
        }
    }, [data.links]);


    const handleDragEnd = (event: DragEndEvent) => {
        setIsDragging(false);

        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = orderedLinks.findIndex(l => l.id === active.id);
        const newIndex = orderedLinks.findIndex(l => l.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const reordered = arrayMove(orderedLinks, oldIndex, newIndex);

        queryClient.setQueryData(['user'], (prevUser: User) => ({
            ...prevUser,
            links: JSON.stringify(reordered)
        }));
    };



    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-[#07071a]">
            <div className="hidden dark:block fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-700/20 rounded-full blur-[130px] pointer-events-none" />
            <div className="hidden dark:block fixed top-[40%] right-[-10%] w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[110px] pointer-events-none" />
            <div className="hidden dark:block fixed bottom-[-15%] left-[25%] w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none" />
            <Header />
            <div className="relative py-10">
                <main className="relative z-10 mx-auto max-w-5xl p-6 md:p-0">

                    <NavigationTabs />

                    <div className="flex justify-end">
                        <Link
                            to={`/${data.handle}`}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.1] hover:bg-slate-50 dark:hover:bg-white/[0.09] hover:border-purple-300 dark:hover:border-purple-400/40 transition-all duration-200 shadow-sm dark:shadow-none"
                        >
                            <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)] animate-pulse flex-shrink-0" />
                            <span className="text-sm font-semibold text-slate-600 dark:text-white/60 group-hover:text-slate-900 dark:group-hover:text-white/90 transition-colors">
                                Ver mi perfil
                            </span>
                            <span className="text-sm text-purple-600 dark:text-purple-400/70 group-hover:text-purple-700 dark:group-hover:text-purple-300 font-mono transition-colors">
                                /{data.handle}
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                            </svg>
                        </Link>
                    </div>

                    <div className="flex flex-col md:flex-row gap-10 mt-10">
                        <div className="flex-1">
                            <Outlet />
                        </div>

                        {/* Panel de vista previa — phone mockup */}
                        <div className="hidden md:flex flex-col items-center gap-4 flex-shrink-0">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 dark:border-cyan-500/30">
                                <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
                                Vista Previa en vivo
                            </span>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="relative w-[272px]"
                            >
                                {/* ── Side buttons ── */}
                                {/* Mute */}
                                <div className="absolute -left-[5px] top-[82px] w-[5px] h-[26px] bg-zinc-700 rounded-l-sm shadow-[-2px_0_4px_rgba(0,0,0,0.5)]" />
                                {/* Vol + */}
                                <div className="absolute -left-[5px] top-[122px] w-[5px] h-[38px] bg-zinc-700 rounded-l-sm shadow-[-2px_0_4px_rgba(0,0,0,0.5)]" />
                                {/* Vol - */}
                                <div className="absolute -left-[5px] top-[172px] w-[5px] h-[38px] bg-zinc-700 rounded-l-sm shadow-[-2px_0_4px_rgba(0,0,0,0.5)]" />
                                {/* Power */}
                                <div className="absolute -right-[5px] top-[130px] w-[5px] h-[52px] bg-zinc-700 rounded-r-sm shadow-[2px_0_4px_rgba(0,0,0,0.5)]" />

                                {/* ── Phone chassis ── */}
                                <div
                                    className="w-full rounded-[42px] bg-zinc-900 p-[8px]"
                                    style={{
                                        boxShadow:
                                            "0 0 0 1px rgba(255,255,255,0.07), 0 0 0 2px rgba(0,0,0,0.8), 0 28px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
                                    }}
                                >
                                    {/* ── Screen ── */}
                                    <div className="rounded-[34px] overflow-hidden bg-[#07071a] relative" style={{ minHeight: 560 }}>

                                        {/* Notch */}
                                        <div className="flex justify-center">
                                            <div className="w-[108px] h-[28px] bg-zinc-900 rounded-b-[18px] flex items-center justify-center gap-2.5">
                                                <div className="w-[32px] h-[4px] rounded-full bg-zinc-700" />
                                                <div className="w-[9px] h-[9px] rounded-full bg-zinc-700 ring-1 ring-zinc-600" />
                                            </div>
                                        </div>

                                        {/* Scrollable content */}
                                        <div className="overflow-y-auto max-h-[504px] px-4 pt-3 pb-2 space-y-3 scrollbar-none">

                                            {data.image && (
                                                <img
                                                    src={data.image}
                                                    alt="Foto de perfil"
                                                    className="mx-auto w-20 h-20 object-cover rounded-full ring-2 ring-white/20 shadow-lg"
                                                />
                                            )}

                                            <div className="text-center">
                                                {data.name && (
                                                    <p className="text-sm font-bold text-white/90 leading-tight">{data.name}</p>
                                                )}
                                                <p className="text-xs font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                                    @{data.handle}
                                                </p>
                                            </div>

                                            {data.description && (
                                                <p className="text-center text-white/50 text-[10px] leading-relaxed px-1">
                                                    {data.description}
                                                </p>
                                            )}

                                            <div className="h-px bg-white/[0.07] mx-2" />

                                            <DndContext
                                                collisionDetection={closestCenter}
                                                onDragStart={() => setIsDragging(true)}
                                                onDragEnd={handleDragEnd}
                                                onDragCancel={() => setIsDragging(false)}
                                            >
                                                <SortableContext
                                                    items={orderedLinks.map(link => link.id)}
                                                    strategy={verticalListSortingStrategy}
                                                >
                                                    <div className="flex flex-col gap-2 pb-1">
                                                        {orderedLinks.length > 0
                                                            ? orderedLinks.map((link) => (
                                                                <SortableLink
                                                                    key={link.id}
                                                                    link={link}
                                                                    isDragging={isDragging}
                                                                />
                                                            ))
                                                            : (
                                                                <p className="text-center text-white/25 italic text-[10px] py-8">
                                                                    Activa algún enlace para verlo aquí
                                                                </p>
                                                            )
                                                        }
                                                    </div>
                                                </SortableContext>
                                            </DndContext>
                                        </div>

                                        {/* Home indicator */}
                                        <div className="flex justify-center py-2">
                                            <div className="w-20 h-1 rounded-full bg-white/15" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </main>
            </div>
            <Toaster position="bottom-left" richColors />
        </div>
    )
}
