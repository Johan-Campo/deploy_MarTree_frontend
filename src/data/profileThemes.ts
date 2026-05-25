export type ProfileThemeData = {
    id: string
    label: string
    previewGradient: string
    bg: string
    orb1: string
    orb2: string
    orb3: string
    particles: string[]
    nodeColor1: string
    nodeColor2: string
    cardGlow: [string, string]
}

export const PROFILE_THEMES: ProfileThemeData[] = [
    {
        id: "eclipse",
        label: "Eclipse",
        previewGradient: "linear-gradient(135deg, #07071a 0%, #1a0a3a 50%, #0a2a2a 100%)",
        bg: "#07071a",
        orb1: "rgba(126,34,206,0.22)",
        orb2: "rgba(20,184,166,0.16)",
        orb3: "rgba(34,211,238,0.11)",
        particles: ["#2dd4bf", "#a78bfa", "#22d3ee", "#f472b6", "#34d399", "#60a5fa"],
        nodeColor1: "#2dd4bf",
        nodeColor2: "#a78bfa",
        cardGlow: ["#14b8a6", "#7c3aed"],
    },
    {
        id: "midnight",
        label: "Midnight",
        previewGradient: "linear-gradient(135deg, #05050f 0%, #0f1a3a 50%, #0a0a30 100%)",
        bg: "#05050f",
        orb1: "rgba(30,64,175,0.30)",
        orb2: "rgba(67,56,202,0.22)",
        orb3: "rgba(14,165,233,0.14)",
        particles: ["#60a5fa", "#818cf8", "#38bdf8", "#a5b4fc", "#93c5fd", "#6366f1"],
        nodeColor1: "#60a5fa",
        nodeColor2: "#818cf8",
        cardGlow: ["#3b82f6", "#6366f1"],
    },
    {
        id: "forest",
        label: "Bosque",
        previewGradient: "linear-gradient(135deg, #051209 0%, #0a2a12 50%, #062020 100%)",
        bg: "#051209",
        orb1: "rgba(20,83,45,0.42)",
        orb2: "rgba(13,148,136,0.24)",
        orb3: "rgba(5,150,105,0.16)",
        particles: ["#4ade80", "#2dd4bf", "#34d399", "#6ee7b7", "#86efac", "#a7f3d0"],
        nodeColor1: "#4ade80",
        nodeColor2: "#2dd4bf",
        cardGlow: ["#22c55e", "#0d9488"],
    },
    {
        id: "sunset",
        label: "Atardecer",
        previewGradient: "linear-gradient(135deg, #130800 0%, #2a1005 50%, #1a0818 100%)",
        bg: "#130800",
        orb1: "rgba(194,65,12,0.30)",
        orb2: "rgba(219,39,119,0.22)",
        orb3: "rgba(234,179,8,0.12)",
        particles: ["#fb923c", "#f472b6", "#facc15", "#fbbf24", "#f43f5e", "#fd7e14"],
        nodeColor1: "#fb923c",
        nodeColor2: "#f472b6",
        cardGlow: ["#ea580c", "#db2777"],
    },
    {
        id: "ocean",
        label: "Océano",
        previewGradient: "linear-gradient(135deg, #020d18 0%, #051a30 50%, #021818 100%)",
        bg: "#020d18",
        orb1: "rgba(3,105,161,0.32)",
        orb2: "rgba(8,145,178,0.24)",
        orb3: "rgba(5,182,212,0.15)",
        particles: ["#38bdf8", "#34d399", "#22d3ee", "#7dd3fc", "#6ee7b7", "#a5f3fc"],
        nodeColor1: "#38bdf8",
        nodeColor2: "#34d399",
        cardGlow: ["#0ea5e9", "#10b981"],
    },
    {
        id: "rose",
        label: "Rosa",
        previewGradient: "linear-gradient(135deg, #11030f 0%, #2a0520 50%, #0f0520 100%)",
        bg: "#11030f",
        orb1: "rgba(190,18,60,0.26)",
        orb2: "rgba(168,85,247,0.20)",
        orb3: "rgba(244,63,94,0.14)",
        particles: ["#f43f5e", "#e879f9", "#fb7185", "#c084fc", "#a78bfa", "#f9a8d4"],
        nodeColor1: "#f43f5e",
        nodeColor2: "#e879f9",
        cardGlow: ["#e11d48", "#a21caf"],
    },
]

export function getProfileTheme(id?: string): ProfileThemeData {
    return PROFILE_THEMES.find(t => t.id === id) ?? PROFILE_THEMES[0]
}
