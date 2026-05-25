import { Outlet } from "react-router-dom"
import { Toaster } from "sonner"
import Logo from "../components/Logo"

export default function PublicLayout() {
    return (
        <>
            <div
                className="relative min-h-screen overflow-hidden"
                style={{ backgroundColor: "var(--public-bg, #07071a)" }}
            >
                <div className="relative z-10 pt-10 flex justify-center">
                    <Logo />
                </div>

                <div className="relative z-10 max-w-lg mx-auto px-5 py-10">
                    <Outlet />
                </div>
            </div>

            <Toaster position="bottom-left" richColors />
        </>
    )
}
