import { useState, useEffect } from "react"
import type { CustomLink, SocialNetwork, UserHandle } from "../types"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import ParallaxAvatar from "./ParallaxAvatar"
import styles from "./HandleData.module.css"
import { recordVisit, recordClick } from "../api/MarTreeApi"
import { getProfileTheme } from "../data/profileThemes"
import CustomLinkIconRenderer from "./CustomLinkIconRenderer"
import { CUSTOM_LINK_ICONS } from "../data/customLinkIcons"

const networkNames: Record<string, string> = {
    facebook:  'Facebook',
    github:    'GitHub',
    instagram: 'Instagram',
    x:         'X / Twitter',
    youtube:   'YouTube',
    tiktok:    'TikTok',
    twitch:    'Twitch',
    linkedin:  'LinkedIn',
}

// Iconos de redes sociales que flotan en el fondo (referencia al proyecto)
const ghostIcons = ['instagram', 'github', 'linkedin', 'youtube', 'tiktok', 'x', 'facebook', 'twitch']

// Posiciones/tamaños de los orbs (los colores vienen del tema)
const orbsLayout = [
    {
        size: 460,
        style: { top: '0%', left: '-10%' } as React.CSSProperties,
        dur: 22, dx: [0, 45, -18, 0], dy: [0, -30, 22, 0],
    },
    {
        size: 340,
        style: { bottom: '5%', right: '-8%' } as React.CSSProperties,
        dur: 28, dx: [0, -35, 22, 0], dy: [0, 28, -18, 0],
    },
    {
        size: 300,
        style: { top: '38%', left: '42%' } as React.CSSProperties,
        dur: 19, dx: [0, 22, -32, 12, 0], dy: [0, -22, 16, -8, 0],
    },
]

// Nodos para la red de conexiones SVG
const nodes = [
    { cx: '12%', cy: '18%' }, { cx: '88%', cy: '14%' },
    { cx: '5%',  cy: '52%' }, { cx: '92%', cy: '60%' },
    { cx: '25%', cy: '80%' }, { cx: '72%', cy: '85%' },
    { cx: '50%', cy: '45%' }, { cx: '38%', cy: '30%' },
    { cx: '65%', cy: '28%' },
]

const nodeEdges = [
    [0,7],[7,8],[8,1],[0,2],[1,3],[7,6],[6,8],[2,4],[3,5],[4,6],[5,6],[6,3],
]

type HandleDataProps = {
    data: UserHandle
}

export default function HandleData({ data }: HandleDataProps) {
    const theme = getProfileTheme(data.theme)

    const links: SocialNetwork[] = JSON.parse(data.links)
        .filter((l: SocialNetwork) => l.enabled)

    const customLinks: CustomLink[] = (() => {
        try { return JSON.parse(data.customLinks ?? "[]").filter((l: CustomLink) => l.enabled) }
        catch { return [] }
    })()

    const [copied, setCopied] = useState(false)

    useEffect(() => {
        recordVisit(data.handle)
    }, [data.handle])

    // Aplica el color de fondo del tema al layout
    useEffect(() => {
        document.documentElement.style.setProperty("--public-bg", theme.bg)
        document.body.style.backgroundColor = theme.bg
        return () => {
            document.documentElement.style.removeProperty("--public-bg")
            document.body.style.backgroundColor = ""
        }
    }, [theme.bg])

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            toast.success("¡Enlace del perfil copiado!")
            setTimeout(() => setCopied(false), 2500)
        } catch {
            toast.error("No se pudo copiar el enlace")
        }
    }

    return (
        <div className="relative min-h-[60vh] pb-6">

            {/* ══════════════════════════════════════════
                CAPA 1 — Orbs animados que derivan (fixed)
            ══════════════════════════════════════════ */}
            <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
                {orbsLayout.map((orb, i) => (
                    <motion.div
                        key={`orb-${i}`}
                        className="absolute rounded-full"
                        style={{
                            ...orb.style,
                            width:  orb.size,
                            height: orb.size,
                            background: [theme.orb1, theme.orb2, theme.orb3][i],
                            filter: 'blur(90px)',
                        }}
                        animate={{ x: orb.dx, y: orb.dy }}
                        transition={{
                            duration: orb.dur,
                            repeat: Infinity,
                            repeatType: 'mirror',
                            ease: 'easeInOut',
                            delay: i * 3,
                        }}
                    />
                ))}
            </div>

            {/* ══════════════════════════════════════════
                CAPA 2 — Red de nodos conectados (SVG fijo)
            ══════════════════════════════════════════ */}
            <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <radialGradient id="nodeGrad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
                        </radialGradient>
                    </defs>

                    {/* Líneas de conexión */}
                    {nodeEdges.map(([a, b], i) => (
                        <motion.line
                            key={`edge-${i}`}
                            x1={nodes[a].cx} y1={nodes[a].cy}
                            x2={nodes[b].cx} y2={nodes[b].cy}
                            stroke="url(#nodeGrad)"
                            strokeWidth="0.6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.18, 0.08, 0.18, 0] }}
                            transition={{
                                duration: 6 + i * 0.8,
                                repeat: Infinity,
                                delay: i * 0.6,
                                ease: 'easeInOut',
                            }}
                        />
                    ))}

                    {/* Nodos */}
                    {nodes.map((node, i) => (
                        <motion.circle
                            key={`node-${i}`}
                            cx={node.cx} cy={node.cy} r="2.5"
                            fill={i % 2 === 0 ? theme.nodeColor1 : theme.nodeColor2}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                                opacity: [0, 0.5, 0.25, 0.5, 0],
                                scale:   [0.8, 1.3, 1, 1.2, 0.8],
                            }}
                            transition={{
                                duration: 5 + i * 0.7,
                                repeat: Infinity,
                                delay: i * 0.5,
                                ease: 'easeInOut',
                            }}
                        />
                    ))}
                </svg>
            </div>

            {/* ══════════════════════════════════════════
                CAPA 3 — Iconos fantasma de redes sociales
            ══════════════════════════════════════════ */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                {ghostIcons.map((name, i) => (
                    <motion.div
                        key={`ghost-${name}`}
                        className="absolute"
                        style={{
                            width:  38 + (i % 3) * 8,
                            height: 38 + (i % 3) * 8,
                            left: `${4 + i * 11.5}%`,
                            bottom: -60,
                        }}
                        animate={{
                            y:       [0, -1100],
                            x:       [0, (i % 2 === 0 ? 28 : -28), (i % 2 === 0 ? -18 : 18), 0],
                            opacity: [0, 0.09, 0.09, 0.07, 0],
                            rotate:  [0, i % 2 === 0 ? 12 : -12, i % 2 === 0 ? -8 : 8, 0],
                        }}
                        transition={{
                            duration: 26 + i * 3.5,
                            repeat: Infinity,
                            delay: i * 4.2,
                            ease: 'linear',
                            times: [0, 0.15, 0.75, 0.92, 1],
                        }}
                    >
                        <img
                            src={`/social/icon_${name}.svg`}
                            alt=""
                            draggable={false}
                            className="w-full h-full object-contain select-none"
                            style={{ filter: 'brightness(0) invert(1)' }}
                        />
                    </motion.div>
                ))}
            </div>

            {/* ══════════════════════════════════════════
                CAPA 4 — Partículas de color (original)
            ══════════════════════════════════════════ */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                {Array.from({ length: 9 }).map((_, i) => (
                    <motion.span
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width:  2 + (i % 3),
                            height: 2 + (i % 3),
                            bottom: 0,
                            left: `${5 + i * 10}%`,
                            background: theme.particles[i % theme.particles.length],
                        }}
                        animate={{
                            y: [0, -900],
                            opacity: [0.45, 0],
                            scale: [1, 0.2],
                        }}
                        transition={{
                            duration: 9 + i * 2.4,
                            repeat: Infinity,
                            delay: i * 1.7,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>

            {/* ── Content ── */}
            <div className="relative z-10">

                {/* Avatar */}
                {data.image ? (
                    <ParallaxAvatar image={data.image} />
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.75 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.55, type: "spring", stiffness: 200, damping: 18 }}
                        className="mt-4 mb-6 flex justify-center"
                    >
                        <div className="w-24 h-24 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                            </svg>
                        </div>
                    </motion.div>
                )}

                {/* Name + Handle */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                    className="text-center mb-3"
                >
                    {data.name && (
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.25 }}
                            className="text-2xl font-bold text-white/90 mb-1 tracking-tight"
                        >
                            {data.name}
                        </motion.h1>
                    )}
                    <span className={styles.handleText}>@{data.handle}</span>
                </motion.div>

                {/* Share button */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.38 }}
                    className="flex justify-center mb-5"
                >
                    <motion.button
                        onClick={handleShare}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.93 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.08] hover:border-teal-400/30 text-xs text-white/40 hover:text-white/70 transition-all duration-200 cursor-pointer"
                    >
                        <AnimatePresence mode="wait">
                            {copied ? (
                                <motion.span
                                    key="copied"
                                    initial={{ opacity: 0, scale: 0.6, y: 4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.6, y: -4 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center gap-1.5 text-teal-400"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    ¡Copiado!
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="share"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-1.5"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                    Compartir perfil
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </motion.div>

                {/* Description */}
                {data.description && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.44 }}
                        className="text-center mb-6"
                    >
                        <p className="text-white/55 text-sm leading-relaxed">
                            {data.description}
                        </p>
                    </motion.div>
                )}

                {/* Animated divider */}
                <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: 0.55, duration: 0.7, ease: "easeOut" }}
                    style={{ originX: 0.5 }}
                    className="h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent mb-6"
                />

                {/* ── Custom link cards ── */}
                {customLinks.length > 0 && (
                    <div className="flex flex-col gap-3 mb-3">
                        {customLinks.map((link, index) => (
                            <motion.a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer noopener"
                                onClick={() => recordClick(data.handle, `custom_${link.id}`)}
                                initial={{ opacity: 0, x: -18 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.52 + index * 0.08, type: "spring", stiffness: 260, damping: 22 }}
                                whileHover={{ scale: 1.025, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                className={`group relative block ${styles.linkCard}`}
                            >
                                <motion.div
                                    className="absolute -inset-px rounded-2xl"
                                    style={{ background: `linear-gradient(to right, ${theme.cardGlow[0]}, ${theme.cardGlow[1]})` }}
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 0.45 }}
                                    transition={{ duration: 0.25 }}
                                />
                                <div className="relative flex items-center gap-4 px-4 py-3.5 bg-white/[0.05] group-hover:bg-white/[0.09] border border-white/[0.07] group-hover:border-white/[0.16] rounded-2xl backdrop-blur-sm transition-colors duration-200 overflow-hidden">
                                    <div className={styles.shimmer} />
                                    {/* Icon */}
                                    {(() => {
                                        const def = CUSTOM_LINK_ICONS.find(i => i.id === link.emoji)
                                        return (
                                            <div
                                                className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center"
                                                style={{ background: def ? `${def.color}22` : "rgba(255,255,255,0.07)" }}
                                            >
                                                <CustomLinkIconRenderer
                                                    value={link.emoji}
                                                    size={20}
                                                    color={def?.color ?? "rgba(255,255,255,0.6)"}
                                                />
                                            </div>
                                        )
                                    })()}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-white/90 text-sm leading-none mb-0.5">{link.title}</p>
                                        <p className="text-[11px] text-white/30 truncate">{link.url}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                        <span className="text-[10px] font-semibold text-transparent group-hover:text-white/45 transition-colors duration-200 tracking-wider uppercase hidden sm:block">Abrir</span>
                                        <motion.svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white/25 group-hover:text-white/65" fill="currentColor" viewBox="0 0 20 20" whileHover={{ x: 2 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </motion.svg>
                                    </div>
                                </div>
                            </motion.a>
                        ))}

                        {/* Divider between custom and social links */}
                        {links.length > 0 && (
                            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent my-1" />
                        )}
                    </div>
                )}

                {/* ── Social link cards ── */}
                <div className="flex flex-col gap-3">
                    {links.length > 0 ? (
                        links.map((link, index) => (
                            <motion.a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer noopener"
                                onClick={() => recordClick(data.handle, link.name)}
                                initial={{ opacity: 0, x: -18 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    delay: 0.52 + index * 0.08,
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 22,
                                }}
                                whileHover={{ scale: 1.025, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                className={`group relative block ${styles.linkCard}`}
                            >
                                {/* Gradient glow border on hover */}
                                <motion.div
                                    className="absolute -inset-px rounded-2xl"
                                    style={{ background: `linear-gradient(to right, ${theme.cardGlow[0]}, ${theme.cardGlow[1]})` }}
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 0.45 }}
                                    transition={{ duration: 0.25 }}
                                />

                                {/* Card body */}
                                <div className="relative flex items-center gap-4 px-4 py-3.5 bg-white/[0.05] group-hover:bg-white/[0.09] border border-white/[0.07] group-hover:border-white/[0.16] rounded-2xl backdrop-blur-sm transition-colors duration-200 overflow-hidden">

                                    {/* CSS shimmer sweep */}
                                    <div className={styles.shimmer} />

                                    {/* Icon */}
                                    <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                                        <img
                                            src={`/social/icon_${link.name}.svg`}
                                            alt={networkNames[link.name] || link.name}
                                            className="w-11 h-11 object-contain"
                                            style={link.name === 'github' ? { filter: 'invert(1) brightness(1.4)' } : undefined}
                                        />
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-white/90 text-sm leading-none mb-0.5">
                                            {networkNames[link.name] || link.name}
                                        </p>
                                        <p className="text-[11px] text-white/30 truncate">
                                            {link.url}
                                        </p>
                                    </div>

                                    {/* CTA hint + arrow */}
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                        <span className="text-[10px] font-semibold text-transparent group-hover:text-white/45 transition-colors duration-200 tracking-wider uppercase hidden sm:block">
                                            Abrir
                                        </span>
                                        <motion.svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-4 h-4 text-white/25 group-hover:text-white/65"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            whileHover={{ x: 2 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                        >
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </motion.svg>
                                    </div>
                                </div>
                            </motion.a>
                        ))
                    ) : customLinks.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="text-center py-12 flex flex-col items-center gap-3"
                        >
                            <motion.div
                                animate={{ rotate: [0, 8, -8, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </motion.div>
                            <p className="text-white/25 text-sm italic">
                                Este perfil aún no tiene enlaces activos
                            </p>
                        </motion.div>
                    ) : null}
                </div>

                {/* Footer branding */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="mt-10 pt-6 border-t border-white/[0.06] text-center"
                >
                    <a
                        href="/"
                        className="inline-flex items-center gap-1.5 text-xs text-white/20 hover:text-white/50 transition-colors duration-200 group"
                    >
                        <span className="font-black bg-gradient-to-r from-purple-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent group-hover:opacity-100 transition-opacity">
                            MarTree
                        </span>
                        <span>— Crea tu perfil gratis</span>
                    </a>
                </motion.div>
            </div>
        </div>
    )
}
