import { Outlet, useLocation } from "react-router-dom"
import { Toaster } from "sonner"
import Logo from "../components/Logo"
import { useForceDark } from "../hooks/useForceDark"

export default function AuthLayout() {

    useForceDark()
    const location = useLocation()
    const isNotFound = location.pathname === "/404"

    return (
        <>
            <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-[#07071a]">
                <div className="hidden dark:block absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-purple-700/20 rounded-full blur-[130px] pointer-events-none" />
                <div className="hidden dark:block absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-teal-500/15 rounded-full blur-[120px] pointer-events-none" />
                <div className="hidden dark:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 pt-10 flex justify-center">
                    <Logo />
                </div>

                {isNotFound ? (
                    <div className="relative z-10 mt-10">
                        <Outlet />
                    </div>
                ) : (
                    <div className="relative z-10 max-w-lg mx-auto px-5 py-10">
                        <Outlet />
                    </div>
                )}
            </div>

            <Toaster position="bottom-left" richColors />
        </>
    )
}
