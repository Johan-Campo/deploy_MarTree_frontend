import { Outlet, useLocation } from "react-router-dom"
import { Toaster } from "sonner"
import Logo from "../components/Logo"

export default function AuthLayout() {

    const location = useLocation()
    const isNotFound = location.pathname === "/404"

    return (
        <>
            <div className="bg-gray-950 min-h-screen">
                
                
                <div className="pt-10 flex justify-center">
                    <Logo />
                </div>

               
                {isNotFound ? (
                    <div className="mt-10">
                        <Outlet />
                    </div>
                ) : (
                    <div className="max-w-lg mx-auto px-5 py-10">
                        <Outlet />
                    </div>
                )}
            </div>

            <Toaster position="bottom-left" richColors />
        </>
    )
}