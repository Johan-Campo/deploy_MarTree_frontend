import type { SocialNetwork, UserHandle } from "../types"
import { motion } from "framer-motion"
import ParallaxAvatar from "./ParallaxAvatar"

type HandleDataProps = {
    data: UserHandle
}

export default function HandleData({ data }: HandleDataProps) {

    const links: SocialNetwork[] = JSON.parse(data.links)
        .filter((link: SocialNetwork) => link.enabled)

    return (
        <div className="relative z-10 max-w-xl mx-auto px-6 text-white">

            
            <div className="absolute inset-0 -z-10 overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                    <span
                        key={i}
                        className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#00E676] via-[#00B0FF] to-[#7C4DFF] opacity-40 animate-float"
                        style={{
                            left: `${(i * 5) % 100}%`,
                            animationDuration: `${6 + i % 5}s`,
                            animationDelay: `${i * 0.3}s`
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, filter: "blur(20px)", y: 40 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-xl mx-auto px-6 py-16"
            >

                
                <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl text-center font-black tracking-wide bg-gradient-to-r from-[#00E676] via-[#00B0FF] to-[#7C4DFF] bg-clip-text text-transparent"
                >
                    @{data.handle}
                </motion.p>

                
                {data.image && (
                    <ParallaxAvatar image={data.image} />
                )}

               
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-10 text-center text-white/80 text-lg leading-relaxed"
                >
                    {data.description || (
                        <span className="italic text-white/40">
                            Este usuario no ha añadido una descripción todavía.
                        </span>
                    )}
                </motion.p>

                
                <div className="mt-16 flex flex-col gap-6">
                    {links.length ? links.map((link, index) => (
                        <motion.a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05 }}
                            className="relative group overflow-hidden rounded-xl p-[2px]"
                        >
                            
                            <div className="absolute inset-0 bg-gradient-to-r from-[#00E676] via-[#00B0FF] to-[#7C4DFF] opacity-70 group-hover:opacity-100 blur-sm transition-all duration-500"></div>

                            <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-xl px-6 py-4 flex items-center gap-5 transition-all duration-500 group-hover:bg-gray-900">

                                <img
                                    src={`/social/icon_${link.name}.svg`}
                                    alt="icono red social"
                                    className="w-10"
                                />

                                <p className="font-semibold text-lg capitalize tracking-wide">
                                    Visita mi {link.name}
                                </p>

                            </div>
                        </motion.a>
                    ))
                        : (
                            <p className="text-center text-white/40">
                                No hay enlaces en este perfil
                            </p>
                        )}
                </div>
            </motion.div>

            
            <style>
                {`
                @keyframes float {
                    0% {
                        transform: translateY(0px);
                        opacity: 0.4;
                    }
                    100% {
                        transform: translateY(-100vh);
                        opacity: 0;
                    }
                }

                .animate-float {
                    animation: float linear infinite;
                }
                `}
            </style>
        </div>
    )
}