import {
    Globe, FileText, Briefcase, Code, Rocket, Mail, MessageCircle,
    Smartphone, Music, Camera, Video, BookOpen, ShoppingBag, MapPin,
    Coffee, Star, Award, Heart, Link, Crown, Zap, Flame, Target, Podcast,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type CustomLinkIconDef = {
    id: string
    label: string
    color: string
    icon: LucideIcon
}

export const CUSTOM_LINK_ICONS: CustomLinkIconDef[] = [
    { id: "Globe",         label: "Web",       color: "#2dd4bf", icon: Globe         },
    { id: "Briefcase",     label: "Trabajo",   color: "#a78bfa", icon: Briefcase     },
    { id: "Code",          label: "Código",    color: "#34d399", icon: Code          },
    { id: "Rocket",        label: "Proyecto",  color: "#f472b6", icon: Rocket        },
    { id: "FileText",      label: "CV/Doc",    color: "#60a5fa", icon: FileText      },
    { id: "BookOpen",      label: "Blog",      color: "#fbbf24", icon: BookOpen      },
    { id: "Mail",          label: "Email",     color: "#fb923c", icon: Mail          },
    { id: "MessageCircle", label: "Chat",      color: "#4ade80", icon: MessageCircle },
    { id: "Smartphone",    label: "App",       color: "#38bdf8", icon: Smartphone    },
    { id: "Video",         label: "Video",     color: "#f87171", icon: Video         },
    { id: "Music",         label: "Música",    color: "#e879f9", icon: Music         },
    { id: "Podcast",       label: "Podcast",   color: "#818cf8", icon: Podcast       },
    { id: "Camera",        label: "Fotos",     color: "#f9a8d4", icon: Camera        },
    { id: "ShoppingBag",   label: "Tienda",    color: "#86efac", icon: ShoppingBag   },
    { id: "MapPin",        label: "Lugar",     color: "#fb923c", icon: MapPin        },
    { id: "Coffee",        label: "Donación",  color: "#d97706", icon: Coffee        },
    { id: "Heart",         label: "Personal",  color: "#f43f5e", icon: Heart         },
    { id: "Star",          label: "Destacado", color: "#facc15", icon: Star          },
    { id: "Crown",         label: "Premium",   color: "#f59e0b", icon: Crown         },
    { id: "Award",         label: "Logro",     color: "#c084fc", icon: Award         },
    { id: "Flame",         label: "Trending",  color: "#ef4444", icon: Flame         },
    { id: "Zap",           label: "Rápido",    color: "#eab308", icon: Zap           },
    { id: "Target",        label: "Objetivo",  color: "#8b5cf6", icon: Target        },
    { id: "Link",          label: "Enlace",    color: "#94a3b8", icon: Link          },
]

export const ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
    CUSTOM_LINK_ICONS.map(i => [i.id, i.icon])
)

export const DEFAULT_ICON = "Globe"

export function isLucideIcon(value: string): boolean {
    return value in ICON_MAP
}
