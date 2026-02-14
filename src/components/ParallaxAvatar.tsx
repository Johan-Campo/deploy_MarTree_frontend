import { useEffect, useState } from "react"
import { motion } from "framer-motion"

function ParallaxAvatar({ image }: { image: string }) {

    const [position, setPosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window
            const x = (e.clientX - innerWidth / 2) / 40
            const y = (e.clientY - innerHeight / 2) / 40
            setPosition({ x, y })
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative mt-10 flex justify-center items-center"
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`
            }}
        >

           
            <div className="absolute w-[440px] h-[440px] rounded-full 
      bg-[radial-gradient(circle,rgba(0,255,200,0.28)_0%,rgba(0,200,255,0.22)_35%,rgba(140,100,255,0.18)_60%,transparent_75%)]
      blur-3xl opacity-70">
            </div>

            
            <div className="absolute w-[520px] h-[520px] rounded-full 
      bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,transparent_65%)]
      blur-3xl opacity-60">
            </div>

            
            <div className="relative">

                
                <div className="absolute inset-0 rounded-full border border-white scale-110"></div>

                <img
                    src={image}
                    className="bg-gray-800/80 relative w-[210px] h-[210px] object-cover rounded-full 
        border-4 border-[#f1f5f9]/70 shadow-[0_0_35px_rgba(255,255,255,0.08)]"
                />
            </div>

        </motion.div>
    )
}

export default ParallaxAvatar