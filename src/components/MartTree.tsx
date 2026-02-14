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
        <div className="
    relative min-h-screen overflow-hidden
    bg-no-repeat bg-center bg-cover" style={{
                backgroundImage: "url('/BackGround.svg')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "top center",
                backgroundSize: "cover",
                backgroundColor: "#f8fafc"
            }} >
            < Header />
            <div
                className="relative min-h-screen py-10 overflow-hidden bg-gray-200/40"
            >
                <main className="relative z-10 mx-auto max-w-5xl p-10 md:p-0">

                    <NavigationTabs />

                    <div className="flex justify-end pr-11">
                        <Link
                            className="font-bold text-center text-black text-2xl hover:underline "
                            to={`/${data.handle}`}
                            target="_blank"
                            rel="noreferrer noopener"
                        >Visitar Mi Perfil: /{data.handle}</Link>
                    </div>

                    <div className="flex flex-col md:flex-row gap-10 mt-10">
                        <div className="flex-1 ">
                            <Outlet />
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            whileHover={{ scale: 1.03 }}
                            className="
    w-full md:w-96
    rounded-2xl
    bg-[linear-gradient(60deg,_rgb(64,_180,_140),_rgb(72,_160,_200),_rgb(96,_140,_220),_rgb(110,_120,_210),_rgb(130,_110,_200),_rgb(150,_120,_210))] 
    backdrop-blur-xl
    border border-black/10
    shadow-2xl
    px-6 py-8
    space-y-6
  "
                        >

                            <h2 className="text-4xl font-black text-center text-white tracking-wide">
                                {data.handle}
                            </h2>


                            {data.image && (
                                <motion.img
                                    src={data.image}
                                    alt="Imagen de perfil"
                                    whileHover={{ scale: 1.05 }}
                                    className="
        mx-auto
        w-[200px] h-[200px]
        object-cover
        rounded-full
        ring-8 ring-white
        shadow-lg bg-black/50
      "
                                />
                            )}


                            <p className="text-center text-white/90 text-lg leading-relaxed">
                                {data.description || (
                                    <span className="italic text-white/60">
                                        Este usuario no ha añadido una descripción todavía.
                                    </span>
                                )}
                            </p>

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
                                    <div className="mt-20 flex flex-col gap-5">
                                        {orderedLinks.map((link) => (
                                            <SortableLink
                                                key={link.id}
                                                link={link}
                                                isDragging={isDragging}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>

                            </DndContext>

                        </motion.div>
                    </div>
                </main>
            </div>
            <Toaster position="bottom-left" richColors />
        </div>
    )
}
