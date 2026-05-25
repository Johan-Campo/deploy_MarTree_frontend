import { useRef, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { useQueryClient } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Download, Check } from "lucide-react"
import type { User } from "../types"

const THEMES = [
    { id: "classic", label: "Clásico",  bg: "#ffffff", fg: "#0f172a" },
    { id: "teal",    label: "Teal",     bg: "#07071a", fg: "#2dd4bf" },
    { id: "purple",  label: "Púrpura",  bg: "#07071a", fg: "#a78bfa" },
    { id: "pink",    label: "Rosa",     bg: "#07071a", fg: "#f472b6" },
]

// Ícono cuadrado del árbol de MarTree como data URI.
// Se genera dinámicamente para que el fondo coincida con el tema del QR.
function makeIconUri(bgColor: string): string {
    const svg = `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <rect width="80" height="80" rx="14" fill="${bgColor}"/>
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2dd4bf"/>
      <stop offset="100%" stop-color="#a78bfa"/>
    </linearGradient>
  </defs>
  <rect x="37" y="42" width="7" height="24" rx="3.5" fill="url(#g1)"/>
  <line x1="40" y1="46" x2="16" y2="22" stroke="url(#g1)" stroke-width="4.5" stroke-linecap="round"/>
  <line x1="40" y1="46" x2="40" y2="14" stroke="url(#g1)" stroke-width="4.5" stroke-linecap="round"/>
  <line x1="40" y1="46" x2="64" y2="22" stroke="url(#g1)" stroke-width="4.5" stroke-linecap="round"/>
  <circle cx="16" cy="22" r="6" fill="#2dd4bf"/>
  <circle cx="40" cy="14" r="6" fill="#22d3ee"/>
  <circle cx="64" cy="22" r="6" fill="#a78bfa"/>
</svg>`
    return `data:image/svg+xml;base64,${btoa(svg)}`
}

export default function QRView() {
    const queryClient = useQueryClient()
    const user = queryClient.getQueryData<User>(["user"])
    const [themeId, setThemeId] = useState("teal")
    const [downloaded, setDownloaded] = useState(false)
    const canvasWrapRef = useRef<HTMLDivElement>(null)

    const theme = THEMES.find(t => t.id === themeId) ?? THEMES[1]
    const profileUrl = user ? `${window.location.origin}/${user.handle}` : ""

    const handleDownload = () => {
        const canvas = canvasWrapRef.current?.querySelector("canvas")
        if (!canvas) return
        const url = canvas.toDataURL("image/png")
        const a = document.createElement("a")
        a.href = url
        a.download = `martree-qr-${user?.handle ?? "perfil"}.png`
        a.click()
        setDownloaded(true)
        toast.success("QR descargado correctamente")
        setTimeout(() => setDownloaded(false), 2500)
    }

    if (!user) return null

    return (
        <div className="flex flex-col items-center gap-7">

            {/* QR card con borde gradiente */}
            <motion.div
                key={themeId}
                initial={{ opacity: 0, scale: 0.88, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
                className="relative p-[3px] rounded-[28px]"
                style={{ background: "linear-gradient(135deg, #2dd4bf, #22d3ee, #a78bfa, #f472b6)" }}
            >
                {/* Glow detrás */}
                <div
                    className="absolute inset-0 rounded-[28px] blur-2xl opacity-40 pointer-events-none"
                    style={{ background: "linear-gradient(135deg, #2dd4bf40, #a78bfa40)" }}
                />

                <div
                    className="relative rounded-[26px] px-8 py-7 flex flex-col items-center gap-4"
                    style={{ background: theme.bg }}
                >
                    {/* Canvas QR */}
                    <div ref={canvasWrapRef}>
                        <QRCodeCanvas
                            value={profileUrl}
                            size={400}
                            style={{ width: 220, height: 220, display: "block" }}
                            bgColor={theme.bg}
                            fgColor={theme.fg}
                            level="H"
                            imageSettings={{
                                src: makeIconUri(theme.bg),
                                height: 72,
                                width: 72,
                                excavate: true,
                            }}
                        />
                    </div>

                    {/* Handle bajo el QR */}
                    <div className="text-center leading-tight">
                        <p className="text-[10px] font-bold tracking-[0.18em] uppercase"
                            style={{ color: theme.fg, opacity: 0.45 }}>
                            martree.com
                        </p>
                        <p className="text-base font-black" style={{ color: theme.fg }}>
                            /{user.handle}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Selector de temas */}
            <div className="flex gap-4 items-end">
                {THEMES.map(t => (
                    <motion.button
                        key={t.id}
                        onClick={() => setThemeId(t.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center gap-1.5"
                    >
                        <div
                            className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200"
                            style={{
                                background: t.bg,
                                border: themeId === t.id
                                    ? `2px solid ${t.fg}`
                                    : "2px solid transparent",
                                boxShadow: themeId === t.id
                                    ? `0 0 14px ${t.fg}55, inset 0 0 0 1px ${t.fg}22`
                                    : "0 0 0 1px rgba(0,0,0,0.12)",
                                opacity: themeId === t.id ? 1 : 0.55,
                            }}
                        >
                            {/* Mini QR simulado */}
                            <div className="grid grid-cols-3 gap-[2px]">
                                {Array.from({ length: 9 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-[5px] h-[5px] rounded-[1px]"
                                        style={{
                                            background: [0,2,4,6,8].includes(i) ? t.fg : "transparent",
                                            opacity: [0,2,6,8].includes(i) ? 1 : 0.4,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        <span
                            className="text-[10px] font-semibold transition-colors"
                            style={{ color: themeId === t.id ? t.fg : undefined }}
                        >
                            <span className={themeId !== t.id ? "text-slate-400 dark:text-white/30" : ""}>
                                {t.label}
                            </span>
                        </span>
                    </motion.button>
                ))}
            </div>

            {/* URL activa */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08]">
                <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.7)] animate-pulse flex-shrink-0" />
                <span className="text-sm font-mono text-slate-600 dark:text-white/55">{profileUrl}</span>
            </div>

            {/* Botón de descarga */}
            <motion.button
                onClick={handleDownload}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-purple-600 text-white text-sm font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-shadow overflow-hidden"
            >
                {/* Shimmer en hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 pointer-events-none" />

                <AnimatePresence mode="wait">
                    {downloaded ? (
                        <motion.span
                            key="done"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            className="flex items-center gap-2"
                        >
                            <Check className="w-4 h-4" strokeWidth={2.5} />
                            ¡Descargado!
                        </motion.span>
                    ) : (
                        <motion.span
                            key="download"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            className="flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" strokeWidth={2.5} />
                            Descargar QR (PNG)
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Nota de calidad */}
            <p className="text-xs text-slate-400 dark:text-white/25 text-center -mt-3">
                Imagen de alta resolución (400 × 400 px) · Funciona en impresos y digitales
            </p>
        </div>
    )
}
