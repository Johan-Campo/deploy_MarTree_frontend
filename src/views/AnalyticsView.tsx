import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"
import { getAnalytics } from "../api/MarTreeApi"
import type { AnalyticsResponse } from "../types"
import { useTheme } from "../context/ThemeContext"
import { Eye, CalendarDays, MousePointerClick } from "lucide-react"

const networkNames: Record<string, string> = {
    facebook: "Facebook",
    github: "GitHub",
    instagram: "Instagram",
    x: "X / Twitter",
    youtube: "YouTube",
    tiktok: "TikTok",
    twitch: "Twitch",
    linkedin: "LinkedIn",
}

function formatDate(dateStr: string) {
    const [, month, day] = dateStr.split("-")
    return `${day}/${month}`
}

type KpiCardProps = {
    label: string
    value: number
    icon: React.ReactNode
    delay: number
    accent: string
}

function KpiCard({ label, value, icon, delay, accent }: KpiCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.45, type: "spring", stiffness: 200, damping: 20 }}
            className="relative overflow-hidden rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.07] p-5"
        >
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 ${accent}`} />
            <div className="relative flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent} bg-opacity-10`}>
                    {icon}
                </div>
                <div>
                    <p className="text-xs text-slate-400 dark:text-white/35 mb-0.5 uppercase tracking-wider font-medium">{label}</p>
                    <p className="text-2xl font-black text-slate-800 dark:text-white/90">{value.toLocaleString()}</p>
                </div>
            </div>
        </motion.div>
    )
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-[#0d0d2b]/90 dark:bg-[#0d0d2b]/90 border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
            <p className="text-white/40 mb-0.5">{label}</p>
            <p className="text-teal-400 font-bold">{payload[0].value} visitas</p>
        </div>
    )
}

export default function AnalyticsView() {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    const chartColors = {
        grid:     isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)",
        axisText: isDark ? "rgba(255,255,255,0.28)" : "rgba(71,85,105,0.7)",
    }

    const { data, isLoading, isError } = useQuery<AnalyticsResponse>({
        queryKey: ["analytics"],
        queryFn: getAnalytics as () => Promise<AnalyticsResponse>,
        staleTime: 1000 * 60 * 5,
    })

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 rounded-2xl bg-slate-200 dark:bg-white/[0.05]" />
                ))}
            </div>
        )
    }

    if (isError || !data) {
        return (
            <div className="text-center py-16">
                <p className="text-slate-400 dark:text-white/30 text-sm">No se pudieron cargar las analíticas.</p>
            </div>
        )
    }

    const clickEntries = Object.entries(data.clickTotals).sort((a, b) => b[1] - a[1])
    const maxClicks = clickEntries[0]?.[1] ?? 1

    return (
        <div className="flex flex-col gap-6">

            {/* KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <KpiCard
                    label="Visitas totales"
                    value={data.totalViews}
                    delay={0}
                    accent="bg-teal-400"
                    icon={<Eye className="w-5 h-5 text-teal-400" strokeWidth={1.8} />}
                />
                <KpiCard
                    label="Esta semana"
                    value={data.weekViews}
                    delay={0.08}
                    accent="bg-purple-400"
                    icon={<CalendarDays className="w-5 h-5 text-purple-400" strokeWidth={1.8} />}
                />
                <KpiCard
                    label="Clics en enlaces"
                    value={data.totalClicks}
                    delay={0.16}
                    accent="bg-cyan-400"
                    icon={<MousePointerClick className="w-5 h-5 text-cyan-400" strokeWidth={1.8} />}
                />
            </div>

            {/* Area chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.07] p-5"
            >
                <p className="text-sm font-semibold text-slate-600 dark:text-white/50 mb-5 uppercase tracking-wider">Visitas — últimos 30 días</p>
                {data.daily.length === 0 ? (
                    <div className="h-40 flex items-center justify-center">
                        <p className="text-slate-300 dark:text-white/20 text-sm italic">Sin datos aún</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={data.daily.map(d => ({ ...d, date: formatDate(d.date) }))} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.35} />
                                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                            <XAxis dataKey="date" tick={{ fontSize: 10, fill: chartColors.axisText }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                            <YAxis tick={{ fontSize: 10, fill: chartColors.axisText }} tickLine={false} axisLine={false} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="views" stroke="#2dd4bf" strokeWidth={2} fill="url(#gradViews)" dot={false} activeDot={{ r: 4, fill: "#2dd4bf" }} />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </motion.div>

            {/* Link clicks breakdown */}
            {clickEntries.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.38, duration: 0.5 }}
                    className="rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.07] p-5"
                >
                    <p className="text-sm font-semibold text-slate-600 dark:text-white/50 mb-5 uppercase tracking-wider">Clics por enlace</p>
                    <div className="flex flex-col gap-3">
                        {clickEntries.map(([name, count], i) => {
                            const isCustom = name.startsWith("custom_")
                            const customMeta = isCustom ? data.customLinkMeta?.[name] : null
                            const label = customMeta?.title ?? networkNames[name] ?? name

                            return (
                                <motion.div
                                    key={name}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.05 }}
                                    className="flex items-center gap-3"
                                >
                                    {/* Ícono: emoji para custom links, imagen para redes sociales */}
                                    <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center bg-slate-100 dark:bg-white/[0.06] overflow-hidden">
                                        {isCustom ? (
                                            <span className="text-lg leading-none">{customMeta?.emoji ?? "🔗"}</span>
                                        ) : (
                                            <img
                                                src={`/social/icon_${name}.svg`}
                                                alt={label}
                                                className="w-8 h-8 object-contain"
                                                style={name === "github" ? { filter: "invert(1) brightness(1.4)" } : undefined}
                                            />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-semibold text-slate-700 dark:text-white/70 truncate">{label}</span>
                                            <span className="text-xs font-bold text-teal-500 dark:text-teal-400 ml-2 flex-shrink-0">{count}</span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-slate-100 dark:bg-white/[0.06] overflow-hidden">
                                            <motion.div
                                                className="h-full rounded-full bg-gradient-to-r from-teal-400 to-purple-500"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(count / maxClicks) * 100}%` }}
                                                transition={{ delay: 0.5 + i * 0.05, duration: 0.6, ease: "easeOut" }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.div>
            )}

            {/* Empty clicks state */}
            {clickEntries.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.07] p-8 text-center"
                >
                    <p className="text-slate-300 dark:text-white/20 text-sm italic">Aún no hay clics registrados en tus enlaces</p>
                </motion.div>
            )}
        </div>
    )
}
