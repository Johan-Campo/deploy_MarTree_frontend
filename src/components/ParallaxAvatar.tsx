import { useEffect } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

function ParallaxAvatar({ image }: { image: string }) {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Spring-based smooth movement (stiffness=80 → floaty feel)
    const springX = useSpring(mouseX, { stiffness: 75, damping: 22, mass: 0.6 })
    const springY = useSpring(mouseY, { stiffness: 75, damping: 22, mass: 0.6 })

    useEffect(() => {
        const handleMove = (e: MouseEvent | TouchEvent) => {
            const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
            const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
            const { innerWidth, innerHeight } = window
            mouseX.set((clientX - innerWidth / 2) / 16)
            mouseY.set((clientY - innerHeight / 2) / 16)
        }

        window.addEventListener("mousemove", handleMove)
        window.addEventListener("touchmove", handleMove, { passive: true })
        return () => {
            window.removeEventListener("mousemove", handleMove)
            window.removeEventListener("touchmove", handleMove)
        }
    }, [mouseX, mouseY])

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 180, damping: 16 }}
            className="flex justify-center items-center mb-6"
            style={{ x: springX, y: springY }}
        >
            <div className="relative">

                {/* Ambient glow behind avatar */}
                <div className="absolute -inset-6 rounded-full bg-gradient-to-br from-teal-500/25 via-cyan-400/15 to-purple-600/25 blur-2xl pointer-events-none" />

                {/* Outer pulsing halo */}
                <motion.div
                    className="absolute -inset-3 rounded-full border border-teal-400/15"
                    animate={{ opacity: [0.6, 0.15, 0.6], scale: [1, 1.06, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Static gradient ring + image */}
                <div
                    className="w-40 h-40 rounded-full p-[3px]"
                    style={{
                        background: "linear-gradient(135deg, #2dd4bf, #22d3ee, #a78bfa)",
                    }}
                >
                    <div className="w-full h-full rounded-full bg-[#07071a] overflow-hidden">
                        <img
                            src={image}
                            alt="Foto de perfil"
                            className="w-full h-full rounded-full object-cover block"
                        />
                    </div>
                </div>

            </div>
        </motion.div>
    )
}

export default ParallaxAvatar
