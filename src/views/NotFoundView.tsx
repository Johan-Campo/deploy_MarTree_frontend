import { Link } from "react-router-dom"
import { motion } from "framer-motion"

export default function NotFoundView() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center gap-6 py-6"
        >
            {/* 404 number */}
            <div className="relative">
                <span className="text-[7rem] leading-none font-black bg-gradient-to-br from-teal-400 via-cyan-300 to-purple-500 bg-clip-text text-transparent select-none">
                    404
                </span>
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-purple-600/20 blur-3xl -z-10 rounded-full" />
            </div>

            {/* Message */}
            <div className="space-y-2">
                <h1 className="text-xl font-bold text-slate-800 dark:text-white/85">
                    Usuario no encontrado
                </h1>
                <p className="text-sm text-slate-500 dark:text-white/40 max-w-xs leading-relaxed">
                    El perfil que buscas no existe o fue eliminado.
                </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-purple-600 text-white text-sm font-bold shadow-lg shadow-purple-600/20 hover:scale-[1.02] hover:shadow-purple-600/35 active:scale-[0.98] transition-all duration-200"
                >
                    Ir al inicio
                </Link>
                <Link
                    to="/auth/login"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.1] text-slate-600 dark:text-white/70 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-white/[0.10] hover:text-slate-900 dark:hover:text-white transition-all duration-200"
                >
                    Iniciar sesión
                </Link>
            </div>
        </motion.div>
    )
}
