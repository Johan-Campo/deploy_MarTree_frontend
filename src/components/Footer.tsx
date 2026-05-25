import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full border-t border-slate-200 dark:border-white/[0.06] mt-auto">
            <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col items-center gap-6">

                {/* Brand */}
                <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl font-black bg-gradient-to-r from-purple-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent tracking-tight">
                        MarTree
                    </span>
                    <p className="text-sm text-slate-500 dark:text-white/25 text-center max-w-xs leading-relaxed">
                        Un enlace para compartir todo lo que eres.
                    </p>
                </div>

                {/* Nav links */}
                <div className="flex items-center gap-1">
                    {['Inicio', 'Ingresar', 'Registrarse'].map((label, i) => {
                        const paths = ['/', '/auth/login', '/auth/register'];
                        return (
                            <React.Fragment key={label}>
                                {i > 0 && <span className="text-slate-300 dark:text-white/[0.12] text-xs px-1">·</span>}
                                <Link
                                    to={paths[i]}
                                    className="text-xs text-slate-400 dark:text-white/25 hover:text-slate-700 dark:hover:text-white/60 transition-colors duration-200"
                                >
                                    {label}
                                </Link>
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Copyright */}
                <p className="text-xs text-slate-400 dark:text-white/[0.18] tracking-wide">
                    © 2026 MarTree — Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
};
