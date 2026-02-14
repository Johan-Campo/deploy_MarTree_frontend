import { useEffect, useMemo, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { social } from "../data/social"
import MarTreeInputs from "../components/MarTreeInputs";
import { isValidUrl } from "../utils";
import { toast } from "sonner";
import { updateProfile } from "../api/MarTreeApi";
import type { SocialNetwork, User } from "../types";



export default function MarTreeView() {

    const [MarTreeLinks, setMarTreeLinks] = useState(social);
    const queryClient = useQueryClient();
    const user: User = queryClient.getQueryData(['user'])!;

    const { mutate } = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            toast.success("Enlaces actualizados correctamente");
        },
        onError: (error) => {
            toast.error(`Error al actualizar el perfil: ${error}`);
        }
    });

    const baseLinks = useMemo(() => {
        if (!user?.links) return social;

        const parsedLinks = JSON.parse(user.links);

        return social.map((item) => {
            const userLink = parsedLinks.find(
                (link: { name: string }) => link.name === item.name
            );

            return userLink
                ? { ...item, url: userLink.url, enabled: userLink.enabled }
                : item;
        });

    }, [user?.links]);

    useEffect(() => {
        setMarTreeLinks(baseLinks);
    }, [baseLinks]);



    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedLinks = MarTreeLinks.map((link) =>
            link.name === e.target.name ? { ...link, url: e.target.value } : link
        );
        setMarTreeLinks(updatedLinks);

    }

    const links: SocialNetwork[] = JSON.parse(user.links || "[]");

    const handleEnableLinks = (socialNetwork: string) => {

        const updatedLinksUI = MarTreeLinks.map(link => {
            if (link.name === socialNetwork) {

   
                if (!link.enabled && !isValidUrl(link.url)) {
                    toast.error("Por favor ingresa una URL válida");
                    return link;
                }

                return { ...link, enabled: !link.enabled };
            }
            return link;
        });

        setMarTreeLinks(updatedLinksUI);

        queryClient.setQueryData(['user'], (prev: User) => {
            const currentLinks: SocialNetwork[] = prev.links
                ? JSON.parse(prev.links)
                : [];

            const toggled = updatedLinksUI.find(l => l.name === socialNetwork);
            if (!toggled) return prev;

            let updatedItems: SocialNetwork[];

            if (toggled.enabled) {
                const exists = currentLinks.find(l => l.name === socialNetwork);

                updatedItems = exists
                    ? currentLinks.map(l =>
                        l.name === socialNetwork
                            ? { ...l, url: toggled.url, enabled: true }
                            : l
                    )
                    : [
                        ...currentLinks,
                        {
                            id: crypto.randomUUID(), 
                            name: toggled.name,
                            url: toggled.url,
                            enabled: true
                        }
                    ];
            } else {
                updatedItems = currentLinks.map(l =>
                    l.name === socialNetwork
                        ? { ...l, enabled: false }
                        : l
                );
            }

            return {
                ...prev,
                links: JSON.stringify(updatedItems)
            };
        });
    };


    return (
        <>
            <div className="space-y-5">
                {MarTreeLinks.map((item) => (
                    <MarTreeInputs key={item.name} item={item} handleUrlChange={handleUrlChange} handleEnableLinks={handleEnableLinks} />
                ))}

                <input
                    onClick={() => {
                        const currentUser = queryClient.getQueryData<User>(['user']);
                        if (!currentUser) return;
                        mutate(currentUser);
                    }}
                    type="submit"
                    value="Guardar Cambios"
                    className="
                w-full
                rounded-xl
                bg-gray-800
                shadow-lg
                py-3
                text-sm
                font-bold
                uppercase
                tracking-wide
                text-white
                cursor-pointer
                hover:shadow-lg
                active:scale-95
                hover:bg-cyan-500 hover:text-white transition-all duration-200 ease-in-out focus:outline-none"
                />

            </div>
        </>
    )
}