import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { SocialNetwork } from "../types";

type Props = {
    link: SocialNetwork;
    isDragging: boolean;
};

export default function SortableLink({ link, isDragging }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: link.id });

    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            role="button"
            tabIndex={0}
            aria-label={`Enlace a ${link.name}. Arrastra para reordenar.`}
            onClick={() => { if (!isDragging) window.open(link.url, "_blank", "noopener,noreferrer"); }}
            onKeyDown={(e) => { if (!isDragging && (e.key === "Enter" || e.key === " ")) window.open(link.url, "_blank", "noopener,noreferrer"); }}
            className="flex items-center gap-3 px-3 py-2.5 bg-white/[0.08] hover:bg-white/[0.13] border border-white/[0.1] hover:border-white/[0.18] rounded-xl cursor-grab active:cursor-grabbing select-none focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-150"
        >
            <GripVertical className="w-3.5 h-3.5 text-white/25 flex-shrink-0" aria-hidden="true" />
            <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                <img
                    src={`/social/icon_${link.name}.svg`}
                    alt={link.name}
                    className="w-7 h-7 object-contain"
                    style={link.name === 'github' ? { filter: 'invert(1) brightness(1.4)' } : undefined}
                />
            </div>
            <p className="text-white/75 text-sm font-medium flex-1 truncate capitalize">
                {link.name}
            </p>
        </div>
    );
}
