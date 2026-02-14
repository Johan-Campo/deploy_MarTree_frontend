import React from "react"

const LoadingOverlay: React.FC = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
            
            <div className="bg-gray-900 border border-white/10 px-8 py-6 rounded-2xl flex flex-col items-center shadow-2xl">
                
                <div className="loader-dots relative w-20 h-5 mt-2">
                    <div className="absolute top-0 w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-cyan-400"></div>
                    <div className="absolute top-0 w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"></div>
                    <div className="absolute top-0 w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400"></div>
                    <div className="absolute top-0 w-3 h-3 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"></div>
                </div>

                <p className="text-gray-300 text-sm mt-4 tracking-wide">
                    Cargando...
                </p>
            </div>

            <style>
                {`
                .loader-dots div {
                    animation-timing-function: cubic-bezier(0, 1, 1, 0);
                }
                .loader-dots div:nth-child(1) {
                    left: 8px;
                    animation: loader-dots1 0.6s infinite;
                }
                .loader-dots div:nth-child(2) {
                    left: 8px;
                    animation: loader-dots2 0.6s infinite;
                }
                .loader-dots div:nth-child(3) {
                    left: 32px;
                    animation: loader-dots2 0.6s infinite;
                }
                .loader-dots div:nth-child(4) {
                    left: 56px;
                    animation: loader-dots3 0.6s infinite;
                }
                @keyframes loader-dots1 {
                    0% { transform: scale(0); }
                    100% { transform: scale(1); }
                }
                @keyframes loader-dots3 {
                    0% { transform: scale(1); }
                    100% { transform: scale(0); }
                }
                @keyframes loader-dots2 {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(24px, 0); }
                }
                `}
            </style>
        </div>
    )
}

export default LoadingOverlay