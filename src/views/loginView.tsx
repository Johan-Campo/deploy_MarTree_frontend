import { NavLink, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { isAxiosError } from "axios"
import ErrorsMessage from "../components/errorsMessage"
import type { LoginForm } from "../types"
import api from "../config/axios"

export default function LoginView() {

    const navigate = useNavigate()

    const initialValues: LoginForm = {
        email: "",
        password: ""
    }

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    const handleLogin = async (data: LoginForm) => {
           try {
            const response = await api.post(`/auth/login`, data)

            localStorage.setItem("AUTH_TOKEN", response.data.token)
            navigate('/admin')
        } catch (error) {
            if(isAxiosError(error) && error.response){
                toast.error(error.response.data.error)
            }
        }
    }

    return (
        <div className="relative flex flex-col items-center min-h-[70vh] mt-10">

            {/* Capas decorativas flotantes */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-80 h-60 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl shadow-2xl -rotate-6 animate-float"></div>
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-80 h-60 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl shadow-2xl rotate-6 animate-float-delay"></div>

            {/* Formulario principal */}
            <form
                onSubmit={handleSubmit(handleLogin)}
                noValidate
                className="relative w-full max-w-md bg-white rounded-3xl px-12 py-14 border-2 border-slate-200 shadow-2xl z-10 animate-slide-fade"
            >
                <h2 className="text-3xl font-bold text-center text-slate-700 mb-8">
                    Iniciar Sesión
                </h2>

                {/* Email */}
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold text-slate-600">
                        E-mail
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        className="
                            w-full h-12 rounded-xl
                            bg-slate-100
                            px-4
                            text-slate-700
                            placeholder-slate-400
                            shadow-inner
                            focus:outline-none
                            focus:ring-2
                            focus:ring-cyan-400
                            transition
                            duration-300
                            ease-in-out
                            focus:scale-105
                        "
                        {...register("email", {
                            required: "El Email es obligatorio",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "E-mail no válido",
                            },
                        })}
                    />
                    {errors.email && <ErrorsMessage>{errors.email.message}</ErrorsMessage>}
                </div>

                {/* Password */}
                <div className="mt-6 space-y-2">
                    <label htmlFor="password" className="text-sm font-semibold text-slate-600">
                        Contraseña
                    </label>
                    <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="
                            w-full h-12 rounded-xl
                            bg-slate-100
                            px-4
                            text-slate-700
                            placeholder-slate-400
                            shadow-inner
                            focus:outline-none
                            focus:ring-2
                            focus:ring-cyan-400
                            transition
                            duration-300
                            ease-in-out
                            focus:scale-105
                        "
                        {...register("password", {
                            required: "El Password es obligatorio",
                        })}
                    />
                    {errors.password && <ErrorsMessage>{errors.password.message}</ErrorsMessage>}
                </div>

                {/* Botón */}
                <button
                    type="submit"
                    className="
                        mt-8 w-full py-3
                        rounded-xl
                        bg-gradient-to-r from-cyan-400 to-blue-500
                        text-white
                        font-bold
                        shadow-xl
                        transition
                        duration-300
                        transform
                        hover:scale-105
                        hover:shadow-2xl
                        hover:-translate-y-1
                        focus:outline-none
                    "
                >
                    Iniciar Sesión
                </button>

                {/* Registro */}
                <div className="mt-6 text-center">
                    <span className="text-gray-600">¿No tienes una cuenta? </span>
                    <NavLink to="/auth/register" className="text-blue-500 font-semibold hover:underline">
                        Regístrate
                    </NavLink>
                </div>
            </form>

         
            <style>
                {`
                @keyframes float {
                    0%, 100% { transform: translateX(-50%) translateY(0) rotate(-6deg); }
                    50% { transform: translateX(-50%) translateY(-10px) rotate(-6deg); }
                }

                @keyframes float-delay {
                    0%, 100% { transform: translateX(-50%) translateY(0) rotate(6deg); }
                    50% { transform: translateX(-50%) translateY(-12px) rotate(6deg); }
                }

                @keyframes slide-fade {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }

                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }

                .animate-float-delay {
                    animation: float-delay 5s ease-in-out infinite;
                }

                .animate-slide-fade {
                    animation: slide-fade 0.8s ease-out forwards;
                }
                `}
            </style>
        </div>
    )
}
