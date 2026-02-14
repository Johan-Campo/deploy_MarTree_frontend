import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { SocialNetwork } from "../types";

type Props = {
    link: SocialNetwork;
    isDragging: boolean;
};

export default function SortableLink({ link, isDragging }: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: link.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => {
                if (!isDragging) {
                    window.open(link.url, "_blank", "noopener,noreferrer");
                }
            }}
            className="
        flex items-center gap-5 p-3
        bg-white/80 hover:bg-white/20
        rounded-lg cursor-grab active:cursor-grabbing
        select-none
    "
        >

            <div
                className="w-8 h-8 bg-cover bg-center rounded-md flex-shrink-0"
                style={{ backgroundImage: `url(/social/icon_${link.name}.svg)` }}
            />
            <p className="text-black font-medium">
                Sígueme en <span className="font-bold">{link.name}</span>
            </p>
        </div>
    );
}
