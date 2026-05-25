import { NavLink, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { isAxiosError } from "axios"
import { useMutation } from "@tanstack/react-query"
import { Mail, Lock } from "lucide-react"
import ErrorsMessage from "../components/ErrorsMessage"
import type { LoginForm } from "../types"
import api from "../config/axios"

export default function LoginView() {
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        defaultValues: { email: "", password: "" }
    })

    const { mutate: login, isPending } = useMutation({
        mutationFn: async (data: LoginForm) => {
            const response = await api.post('/auth/login', data)
            return response.data
        },
        onSuccess: (data) => {
            localStorage.setItem("AUTH_TOKEN", data.token)
            navigate('/admin')
        },
        onError: (error) => {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.error)
            } else {
                toast.error("Error de conexión. Verifica tu internet.")
            }
        }
    })

    const inputClass = "w-full h-12 rounded-xl bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.09] px-4 text-sm text-slate-800 dark:text-white/90 placeholder-slate-400 dark:placeholder-white/20 outline-none transition-all duration-200 focus:border-purple-500 dark:focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/20 dark:focus:ring-purple-400/15"

    const labelClass = "flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-white/40 uppercase tracking-widest"

    return (
        <div className="flex flex-col items-center mt-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="relative bg-white dark:bg-white/[0.04] backdrop-blur-xl border border-slate-200 dark:border-white/[0.09] rounded-3xl px-8 py-10 shadow-lg dark:shadow-2xl">

                    {/* Top gradient line — dark only */}
                    <div className="hidden dark:block absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent rounded-full" />

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-100 dark:bg-gradient-to-br dark:from-purple-600/30 dark:to-teal-500/30 border border-purple-200 dark:border-white/10 mb-4">
                            <Lock className="w-5 h-5 text-purple-600 dark:text-white/60" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white/90">Iniciar Sesión</h2>
                        <p className="text-sm text-slate-500 dark:text-white/35 mt-1">Bienvenido de vuelta</p>
                    </div>

                    <form onSubmit={handleSubmit((data) => login(data))} noValidate className="space-y-5">

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className={labelClass}>
                                <Mail className="w-3.5 h-3.5" />
                                E-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="correo@ejemplo.com"
                                className={inputClass}
                                {...register("email", {
                                    required: "El email es obligatorio",
                                    pattern: { value: /\S+@\S+\.\S+/, message: "Email no válido" },
                                })}
                            />
                            {errors.email && <ErrorsMessage>{errors.email.message}</ErrorsMessage>}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label htmlFor="password" className={labelClass}>
                                <Lock className="w-3.5 h-3.5" />
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className={inputClass}
                                {...register("password", { required: "La contraseña es obligatoria" })}
                            />
                            {errors.password && <ErrorsMessage>{errors.password.message}</ErrorsMessage>}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="
                                w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider mt-2
                                bg-gradient-to-r from-purple-600 to-teal-500 text-white
                                shadow-lg shadow-purple-600/20
                                hover:shadow-purple-600/35 hover:scale-[1.01]
                                active:scale-[0.99] transition-all duration-200
                                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none
                            "
                        >
                            {isPending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                                    Iniciando sesión...
                                </span>
                            ) : "Iniciar Sesión"}
                        </button>

                        {/* Register link */}
                        <p className="text-center text-sm text-slate-500 dark:text-white/35 pt-1">
                            ¿No tienes cuenta?{" "}
                            <NavLink to="/auth/register" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors hover:underline">
                                Regístrate
                            </NavLink>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
