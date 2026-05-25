import AdminNavigation from "./Nav/AdminNavigation";
import Logo from "./Logo";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, ExternalLink } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import type { User } from "../types";

export default function Header() {
    const { theme, toggleTheme } = useTheme();
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData<User>(["user"]);

    return (
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#07071a]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.07]">
            {/* Gradient line — dark mode only */}
            <div className="hidden dark:block h-px w-full bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

            <div className="mx-auto max-w-5xl px-6 lg:px-0 flex items-center justify-between py-4">
                <Logo />

                <div className="flex items-center gap-2">
                    {user?.handle && (
                        <a
                            href={`/${user.handle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 dark:text-white/40 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-400/10 transition-all duration-200"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Ver perfil
                        </a>
                    )}

                    <button
                        onClick={toggleTheme}
                        aria-label="Cambiar tema"
                        className="p-2 rounded-full text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-all duration-200"
                    >
                        {theme === 'dark'
                            ? <Sun className="w-5 h-5 text-yellow-400 dark:text-yellow-300/70" />
                            : <Moon className="w-5 h-5 text-slate-400" />
                        }
                    </button>

                    <div className="relative group">
                        {/* Outer glow on hover */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-teal-500 rounded-xl opacity-40 dark:opacity-60 group-hover:opacity-80 dark:group-hover:opacity-100 blur-sm transition-all duration-300" />
                        <div className="relative bg-gradient-to-r from-purple-600 to-teal-500 p-px rounded-xl">
                            <div className="bg-white dark:bg-[#07071a] rounded-[11px]">
                                <AdminNavigation />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
