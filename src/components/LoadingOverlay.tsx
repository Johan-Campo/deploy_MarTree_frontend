import React from "react"

const LoadingOverlay: React.FC = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07071a]/95 backdrop-blur-sm">

            {/* Orb background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-700/15 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative flex flex-col items-center gap-5">

                {/* Spinner ring */}
                <div className="relative w-14 h-14">
                    <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-teal-400 border-r-purple-500 animate-spin" />
                    {/* Inner dot */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 shadow-[0_0_8px_rgba(94,234,212,0.6)]" />
                    </div>
                </div>

                {/* Brand + text */}
                <div className="flex flex-col items-center gap-1">
                    <span className="text-lg font-black bg-gradient-to-r from-teal-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent tracking-tight">
                        MarTree
                    </span>
                    <p className="text-xs text-white/30 tracking-widest uppercase">
                        Cargando perfil...
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoadingOverlay
