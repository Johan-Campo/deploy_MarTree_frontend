import { Link, useLocation, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { isAxiosError } from "axios"
import { useMutation } from "@tanstack/react-query"
import { Mail, Lock, AtSign, UserPlus, User } from "lucide-react"
import type { RegisterForm } from "../types"
import ErrorsMessage from "../components/ErrorsMessage"
import api from "../config/axios"

export default function RegisterView() {
    const location = useLocation()
    const navigate = useNavigate()

    const initialData: RegisterForm = {
        name: "",
        email: "",
        handle: location?.state?.handle || "",
        password: "",
        password_confirmation: ""
    }

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ defaultValues: initialData })
    const password = watch('password')

    const { mutate: registerUser, isPending } = useMutation({
        mutationFn: async (data: RegisterForm) => {
            const { data: response } = await api.post('/auth/register', data)
            return response
        },
        onSuccess: (response) => {
            toast.success(response)
            reset()
            navigate('/auth/login')
        },
        onError: (error) => {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.error)
            } else {
                toast.error("Error de conexión. Verifica tu internet.")
            }
        }
    })

    const inputClass = "w-full h-12 rounded-xl bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.09] px-4 text-sm text-slate-800 dark:text-white/90 placeholder-slate-400 dark:placeholder-white/20 outline-none transition-all duration-200 focus:border-teal-500 dark:focus:border-purple-400/50 focus:ring-1 focus:ring-teal-400/20 dark:focus:ring-purple-400/15"

    const labelClass = "flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-white/40 uppercase tracking-widest"

    return (
        <div className="flex flex-col items-center mt-2">
            <div className="w-full max-w-md">
                <div className="relative bg-white dark:bg-white/[0.04] backdrop-blur-xl border border-slate-200 dark:border-white/[0.09] rounded-3xl px-8 py-10 shadow-lg dark:shadow-2xl">

                    {/* Top gradient line — dark only */}
                    <div className="hidden dark:block absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent rounded-full" />

                    {/* Header */}
                    <div className="text-center mb-7">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-100 dark:bg-gradient-to-br dark:from-teal-600/30 dark:to-purple-500/30 border border-teal-200 dark:border-white/10 mb-4">
                            <UserPlus className="w-5 h-5 text-teal-600 dark:text-white/60" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white/90">Crear Cuenta</h2>
                        <p className="text-sm text-slate-500 dark:text-white/35 mt-1">Únete a MarTree hoy</p>
                    </div>

                    <form onSubmit={handleSubmit((data) => registerUser(data))} className="space-y-4">

                        {/* Name */}
                        <div className="space-y-1.5">
                            <label htmlFor="name" className={labelClass}>
                                <User className="w-3.5 h-3.5" />
                                Nombre
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Tu nombre completo"
                                className={inputClass}
                                {...register('name', { required: "El nombre es obligatorio" })}
                            />
                            {errors.name && <ErrorsMessage>{errors.name.message}</ErrorsMessage>}
                        </div>

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
                                {...register('email', {
                                    required: "El email es obligatorio",
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email no válido" }
                                })}
                            />
                            {errors.email && <ErrorsMessage>{errors.email.message}</ErrorsMessage>}
                        </div>

                        {/* Handle */}
                        <div className="space-y-1.5">
                            <label htmlFor="handle" className={labelClass}>
                                <AtSign className="w-3.5 h-3.5" />
                                Handle
                            </label>
                            <input
                                id="handle"
                                type="text"
                                placeholder="sin espacios"
                                className={inputClass}
                                {...register('handle', { required: "El handle es obligatorio" })}
                            />
                            {errors.handle && <ErrorsMessage>{errors.handle.message}</ErrorsMessage>}
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
                                {...register('password', {
                                    required: "La contraseña es obligatoria",
                                    minLength: { value: 8, message: "Mínimo 8 caracteres" }
                                })}
                            />
                            {errors.password && <ErrorsMessage>{errors.password.message}</ErrorsMessage>}
                        </div>

                        {/* Confirm password */}
                        <div className="space-y-1.5">
                            <label htmlFor="password_confirmation" className={labelClass}>
                                <Lock className="w-3.5 h-3.5" />
                                Repetir contraseña
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                placeholder="••••••••"
                                className={inputClass}
                                {...register('password_confirmation', {
                                    required: "Confirma tu contraseña",
                                    validate: (value) => value === password || "Las contraseñas no coinciden"
                                })}
                            />
                            {errors.password_confirmation && <ErrorsMessage>{errors.password_confirmation.message}</ErrorsMessage>}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="
                                w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider mt-2
                                bg-gradient-to-r from-teal-500 to-purple-600 text-white
                                shadow-lg shadow-teal-500/20
                                hover:shadow-teal-500/35 hover:scale-[1.01]
                                active:scale-[0.99] transition-all duration-200
                                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none
                            "
                        >
                            {isPending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                                    Registrando...
                                </span>
                            ) : "Crear Cuenta"}
                        </button>

                        {/* Login link */}
                        <p className="text-center text-sm text-slate-500 dark:text-white/35 pt-1">
                            ¿Ya tienes cuenta?{" "}
                            <Link to="/auth/login" className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold transition-colors hover:underline">
                                Inicia Sesión
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
