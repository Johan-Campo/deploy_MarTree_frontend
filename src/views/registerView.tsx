import { Link, useLocation, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { isAxiosError } from "axios"
import type { RegisterForm } from "../types"
import ErrorsMessage from "../components/errorsMessage"
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

    const handleRegister = async(data: RegisterForm) => {
        try {
            const {data: response} = await api.post(`/auth/register`, data)
            toast.success(response)
            reset()
            navigate('/auth/login')
        } catch (error) {
            if(isAxiosError(error) && error.response){
                toast.error(error.response.data.error)
            }
        }
    }

    return (
        <div className="flex flex-col items-center min-h-[80vh] relative">

            
            <form
                onSubmit={handleSubmit(handleRegister)}
                className="
                    relative
                    w-full max-w-md
                    mt-6
                    p-8
                    rounded-3xl
                    bg-gradient-to-r from-cyan-300/20 via-blue-300/20 to-purple-400/20
                    backdrop-blur-2xl
                    border border-white/30
                    shadow-lg shadow-cyan-400/20
                    space-y-5
                    overflow-hidden
                    animate-slide-fade
                "
            >

                
                <div className="absolute inset-0 -z-10">
                    <div className="w-full h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-30 animate-gradient-x rounded-3xl"></div>
                    <div className="absolute w-64 h-64 bg-white/10 rounded-full top-[-20%] left-[-20%] animate-pulse-slow blur-2xl"></div>
                    <div className="absolute w-56 h-56 bg-white/20 rounded-full bottom-[-20%] right-[-10%] animate-pulse-slow blur-3xl"></div>
                </div>

                
                <h2 className="text-3xl font-bold text-white text-center mb-6">
                    Crear Cuenta
                </h2>

                
                <div className="space-y-1">
                    <label htmlFor="name" className="text-sm font-semibold text-white">Nombre</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Tu nombre completo"
                        className="
                            w-full rounded-xl
                            bg-white/30 backdrop-blur-lg
                            px-4 py-3
                            text-black
                            placeholder-white
                            outline-none
                            border border-white/20
                            focus:border-cyan-400
                            focus:ring-4 focus:ring-cyan-400/20
                            transition duration-300
                            hover:scale-[1.01] focus:scale-[1.02]
                        "
                        {...register('name', { required: "Este campo es obligatorio" })}
                    />
                    {errors.name && <ErrorsMessage>{errors.name.message}</ErrorsMessage>}
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-semibold text-white">E-mail</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        className="
                            w-full rounded-xl
                            bg-white/30 backdrop-blur-lg
                            px-4 py-3
                            text-black
                            placeholder-white
                            outline-none
                            border border-white/20
                            focus:border-cyan-400
                            focus:ring-4 focus:ring-cyan-400/20
                            transition duration-300
                            hover:scale-[1.01] focus:scale-[1.02]
                        "
                        {...register('email', {
                            required: "Este campo es obligatorio",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Por favor, ingresa un E-mail válido"
                            }
                        })}
                    />
                    {errors.email && <ErrorsMessage>{errors.email.message}</ErrorsMessage>}
                </div>

                
                <div className="space-y-1">
                    <label htmlFor="handle" className="text-sm font-semibold text-white">Handle</label>
                    <input
                        id="handle"
                        type="text"
                        placeholder="sin espacios"
                        className="
                            w-full rounded-xl
                            bg-white/30 backdrop-blur-lg
                            px-4 py-3
                            text-black
                            placeholder-white
                            outline-none
                            border border-white/20
                            focus:border-cyan-400
                            focus:ring-4 focus:ring-cyan-400/20
                            transition duration-300
                            hover:scale-[1.01] focus:scale-[1.02]
                        "
                        {...register('handle', { required: "Este campo es obligatorio" })}
                    />
                    {errors.handle && <ErrorsMessage>{errors.handle.message}</ErrorsMessage>}
                </div>

                
                <div className="space-y-1">
                    <label htmlFor="password" className="text-sm font-semibold text-white">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="
                            w-full rounded-xl
                            bg-white/30 backdrop-blur-lg
                            px-4 py-3
                            text-black
                            placeholder-white
                            outline-none
                            border border-white/20
                            focus:border-cyan-400
                            focus:ring-4 focus:ring-cyan-400/20
                            transition duration-300
                            hover:scale-[1.01] focus:scale-[1.02]
                        "
                        {...register('password', {
                            required: "Este campo es obligatorio",
                            minLength: { value: 8, message: "Debe tener al menos 8 caracteres" }
                        })}
                    />
                    {errors.password && <ErrorsMessage>{errors.password.message}</ErrorsMessage>}
                </div>

                
                <div className="space-y-1">
                    <label htmlFor="password_confirmation" className="text-sm font-semibold text-white">Repetir Password</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        placeholder="••••••••"
                        className="
                            w-full rounded-xl
                            bg-white/30 backdrop-blur-lg
                            px-4 py-3
                            text-black
                            placeholder-white
                            outline-none
                            border border-white/20
                            focus:border-cyan-400
                            focus:ring-4 focus:ring-cyan-400/20
                            transition duration-300
                            hover:scale-[1.01] focus:scale-[1.02]
                        "
                        {...register('password_confirmation', {
                            required: "Este campo es obligatorio",
                            validate: (value) => value === password || "Las contraseñas no coinciden"
                        })}
                    />
                    {errors.password_confirmation && <ErrorsMessage>{errors.password_confirmation.message}</ErrorsMessage>}
                </div>

                
                <button
                    type="submit"
                    className="
                        w-full py-4
                        rounded-2xl
                        font-bold uppercase tracking-wide
                        text-white
                        bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500
                        shadow-lg shadow-cyan-400/25
                        hover:shadow-cyan-400/50
                        hover:scale-[1.03] active:scale-[0.98]
                        transition-all duration-300
                        focus:outline-none focus:ring-4 focus:ring-cyan-400/30
                    "
                >
                    Registrar Usuario
                </button>

                
                <div className="mt-4 text-center">
                    <Link className="text-white text-lg font-medium hover:underline" to="/auth/login">
                        ¿Ya tienes una cuenta? Inicia Sesión
                    </Link>
                </div>
            </form>

            
            <style>
                {`
                @keyframes slide-fade {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-fade {
                    animation: slide-fade 0.8s ease-out forwards;
                }

                @keyframes gradient-x {
                    0%,100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 10s ease infinite;
                }

                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); opacity: 0.6; }
                    50% { transform: scale(1.1); opacity: 0.9; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 6s ease-in-out infinite;
                }
                `}
            </style>
        </div>
    )
}

