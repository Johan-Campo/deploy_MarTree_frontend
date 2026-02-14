import { useForm } from "react-hook-form";
import { useQueryClient, useMutation } from '@tanstack/react-query';
import ErrorsMessage from "../components/errorsMessage";
import type { profileForm, User } from "../types";
import { updateProfile, uploadProfileImage } from "../api/MarTreeApi";
import { toast } from "sonner";




export default function ProfileView() {

    const queryClient = useQueryClient();
    const data: User = queryClient.getQueryData(['user'])!

    const { register, handleSubmit, formState: { errors } } = useForm<profileForm>({
        defaultValues: {
            handle: data.handle,
            description: data.description
        }
    })

    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onError: (error) => {
            toast.error((error as Error).message);
        },
        onSuccess: () => {
            toast.success("Perfil actualizado correctamente", {
                id: "profile-updated"
            });

            queryClient.invalidateQueries({ queryKey: ['user'] });
        }

    });

    const uploadProfileImageMutation = useMutation({
        mutationFn: uploadProfileImage,
        onError: (error) => {
            toast.error((error as Error).message);
        },
        onSuccess: (data) => {
            console.log(data);

            queryClient.setQueryData(['user'], (prevData: User) => {
                return {
                    ...prevData,
                    image: data.image
                }
            });
            toast.success("Imagen de perfil actualizada", {
                id: "profile-image-updated"
            });

        }
    });

    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            uploadProfileImageMutation.mutate(e.target.files[0])
        }
    }

    const handleUserPrifileForm = (data: profileForm) => {
        const user: User = queryClient.getQueryData(['user'])!;
        user.description = data.description;
        user.handle = data.handle;
        updateProfileMutation.mutate(user);
    }


    return (
        <form
            className="
                bg-white
                p-8 md:p-10
                rounded-2xl
                shadow-sm
                space-y-6
                transition-all
            "
            onSubmit={handleSubmit(handleUserPrifileForm)}
        >
            <legend className="text-2xl font-bold text-slate-800 text-center mb-4">
                Editar Información
            </legend>

            
            <div className="space-y-2">
                <label
                    htmlFor="handle"
                    className="text-sm font-semibold text-slate-600"
                >
                    Handle
                </label>
                <input
                    type="text"
                    className="
                        w-full
                        rounded-lg
                        bg-slate-100
                        px-4 py-2.5
                        text-slate-800
                        placeholder-slate-400
                        outline-none
                        transition-all
                        focus:bg-white
                        focus:ring-2
                        focus:ring-slate-300
                    "
                    placeholder="handle o nombre de usuario"
                    {...register("handle", {
                        required: "El Nombre de usuario es obligatorio",
                        minLength: {
                            value: 3,
                            message: "El Nombre de usuario debe tener al menos 3 caracteres",
                        },
                    })}
                />
                {errors.handle && <ErrorsMessage>{errors.handle.message}</ErrorsMessage>}
            </div>

            
            <div className="space-y-2">
                <label
                    htmlFor="description"
                    className="text-sm font-semibold text-slate-600"
                >
                    Descripción
                </label>
                <textarea
                    className="
                        w-full
                        min-h-[100px]
                        rounded-lg
                        bg-slate-100
                        px-4 py-2.5
                        text-slate-800
                        placeholder-slate-400
                        outline-none
                        resize-none
                        transition-all
                        focus:bg-white
                        focus:ring-2
                        focus:ring-slate-300
                    "
                    placeholder="Cuéntanos algo sobre ti"
                    {...register("description", {
                        required: "La descripción es obligatoria",
                    })}
                />
                {errors.description && <ErrorsMessage>{errors.description.message}</ErrorsMessage>}
            </div>

            
            <div className="space-y-2">
                <label
                    htmlFor="image"
                    className="text-sm font-semibold text-gray-900"
                >
                    Imagen de perfil
                </label>

                <input
                    id="image"
                    type="file"
                    name="handle"
                    accept="image/*"
                    onChange={handleChangeImage}
                    className="
            block w-full text-sm text-slate-500

            file:mr-4
            file:px-2
            file:py-2
            file:rounded-lg
            file:border-0

            file:bg-gradient-to-b
            file:from-slate-900
            file:to-slate-800

            file:text-white
            file:text-[14px]
            file:font-semibold

            file:shadow-lg
            file:shadow-slate-500/40

            hover:file:from-slate-800
            hover:file:to-slate-700

            active:file:scale-[.97]
            active:file:shadow-inner

            transition-all
            cursor-pointer
        "
                />
            </div>


            
            <input
                type="submit"
                value="Guardar Cambios"
                className="
                    w-full
                    rounded-xl
                    bg-gray-800
                    shadow-lg
                    py-3
                    text-sm
                    font-bold
                    uppercase
                    tracking-wide
                    text-white
                    cursor-pointer
                    hover:shadow-lg
                    active:scale-95
                    hover:bg-cyan-500 hover:text-white transition-all duration-200 ease-in-out focus:outline-none"
            />
        </form>
    )
}
