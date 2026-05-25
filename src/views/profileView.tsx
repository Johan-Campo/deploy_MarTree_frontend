import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { CircleUser, Camera, AtSign, PenLine } from "lucide-react";
import { motion } from "framer-motion";
import ErrorsMessage from "../components/ErrorsMessage";
import type { profileForm, User } from "../types";
import { updateProfile, uploadProfileImage } from "../api/MarTreeApi";
import { toast } from "sonner";
import { PROFILE_THEMES } from "../data/profileThemes";

export default function ProfileView() {
    const queryClient = useQueryClient();
    const data = queryClient.getQueryData<User>(['user']);

    const [imagePreview, setImagePreview] = useState<string>(data?.image ?? '');

    const { register, handleSubmit, formState: { errors } } = useForm<profileForm>({
        defaultValues: {
            handle: data?.handle ?? '',
            description: data?.description ?? ''
        }
    });

    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onError: (error) => toast.error((error as Error).message),
        onSuccess: () => {
            toast.success("Perfil actualizado correctamente", { id: "profile-updated" });
            queryClient.invalidateQueries({ queryKey: ['user'] });
        }
    });

    const uploadProfileImageMutation = useMutation({
        mutationFn: uploadProfileImage,
        onError: (error) => toast.error((error as Error).message),
        onSuccess: (data) => {
            queryClient.setQueryData(['user'], (prev: User) => ({ ...prev, image: data.image }));
            setImagePreview(data.image);
            toast.success("Imagen actualizada", { id: "profile-image-updated" });
        }
    });

    const isPending = updateProfileMutation.isPending || uploadProfileImageMutation.isPending;

    const selectedTheme = data?.theme ?? "eclipse"

    const handleThemeSelect = (themeId: string) => {
        const user = queryClient.getQueryData<User>(['user'])
        if (!user) return
        const updated = { ...user, theme: themeId }
        queryClient.setQueryData(['user'], updated)
        updateProfileMutation.mutate(updated)
    }

    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) uploadProfileImageMutation.mutate(e.target.files[0]);
    };

    const handleUserProfileForm = (formData: profileForm) => {
        const user = queryClient.getQueryData<User>(['user']);
        if (!user) return;
        updateProfileMutation.mutate({ ...user, description: formData.description, handle: formData.handle });
    };

    return (
        <div className="flex flex-col gap-5">

            {/* ── Theme selector ── */}
            <div className="bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-3xl p-6">
                <p className="text-xs font-semibold text-slate-500 dark:text-white/40 uppercase tracking-widest mb-4">
                    Tema del perfil público
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {PROFILE_THEMES.map((t) => {
                        const isActive = selectedTheme === t.id
                        return (
                            <motion.button
                                key={t.id}
                                type="button"
                                onClick={() => handleThemeSelect(t.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex flex-col items-center gap-2"
                            >
                                <div
                                    className="w-full aspect-square rounded-2xl transition-all duration-200"
                                    style={{
                                        background: t.previewGradient,
                                        boxShadow: isActive
                                            ? `0 0 0 2px white, 0 0 0 4px ${t.nodeColor1}, 0 6px 20px ${t.nodeColor1}55`
                                            : "0 0 0 1px rgba(0,0,0,0.15)",
                                        opacity: isActive ? 1 : 0.65,
                                    }}
                                >
                                    {isActive && (
                                        <div className="w-full h-full rounded-2xl flex items-center justify-center">
                                            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-lg" />
                                        </div>
                                    )}
                                </div>
                                <span
                                    className="text-[10px] font-semibold transition-colors"
                                    style={{ color: isActive ? t.nodeColor1 : undefined }}
                                >
                                    <span className={isActive ? "" : "text-slate-400 dark:text-white/30"}>
                                        {t.label}
                                    </span>
                                </span>
                            </motion.button>
                        )
                    })}
                </div>
            </div>

        <form
            className="bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] backdrop-blur-sm p-8 md:p-10 rounded-3xl space-y-7 shadow-sm dark:shadow-none"
            onSubmit={handleSubmit(handleUserProfileForm)}
        >
            {/* Avatar + title */}
            <div className="flex flex-col items-center gap-4">
                <label htmlFor="image" className="relative cursor-pointer group" title="Cambiar foto de perfil">
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-slate-200 dark:ring-white/10 group-hover:ring-purple-500/50 transition-all duration-200">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Foto de perfil" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center">
                                <CircleUser className="w-14 h-14 text-slate-300 dark:text-white/20" />
                            </div>
                        )}
                    </div>
                    <div className="absolute bottom-0.5 right-0.5 w-7 h-7 bg-gradient-to-br from-purple-600 to-teal-500 rounded-full flex items-center justify-center shadow-lg opacity-90 group-hover:opacity-100 transition-opacity">
                        {uploadProfileImageMutation.isPending
                            ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            : <Camera className="w-3.5 h-3.5 text-white" />
                        }
                    </div>
                    <input
                        id="image"
                        type="file"
                        name="image"
                        accept="image/*"
                        disabled={isPending}
                        onChange={handleChangeImage}
                        className="sr-only"
                    />
                </label>
                <legend className="text-lg font-bold bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
                    Editar Información
                </legend>
            </div>

            {/* Handle */}
            <div className="space-y-2">
                <label htmlFor="handle" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-white/40 uppercase tracking-widest">
                    <AtSign className="w-3.5 h-3.5" />
                    Handle
                </label>
                <input
                    id="handle"
                    type="text"
                    placeholder="tu-handle"
                    className="
                        w-full rounded-xl bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.09]
                        px-4 py-3 text-sm text-slate-800 dark:text-white/90 placeholder-slate-400 dark:placeholder-white/20
                        outline-none transition-all duration-200
                        focus:border-purple-500 dark:focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/20 dark:focus:ring-purple-400/15
                    "
                    {...register("handle", {
                        required: "El handle es obligatorio",
                        minLength: { value: 3, message: "Mínimo 3 caracteres" },
                    })}
                />
                {errors.handle && <ErrorsMessage>{errors.handle.message}</ErrorsMessage>}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label htmlFor="description" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-white/40 uppercase tracking-widest">
                    <PenLine className="w-3.5 h-3.5" />
                    Descripción
                </label>
                <textarea
                    id="description"
                    placeholder="Cuéntanos algo sobre ti..."
                    rows={4}
                    className="
                        w-full rounded-xl bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.09]
                        px-4 py-3 text-sm text-slate-800 dark:text-white/90 placeholder-slate-400 dark:placeholder-white/20
                        outline-none transition-all duration-200 resize-none
                        focus:border-purple-500 dark:focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/20 dark:focus:ring-purple-400/15
                    "
                    {...register("description", { required: "La descripción es obligatoria" })}
                />
                {errors.description && <ErrorsMessage>{errors.description.message}</ErrorsMessage>}
            </div>

            {/* Save button */}
            <button
                type="submit"
                disabled={isPending}
                className="
                    w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider
                    bg-gradient-to-r from-purple-600 to-teal-500 text-white
                    shadow-lg shadow-purple-600/20
                    hover:shadow-purple-600/35 hover:scale-[1.01]
                    active:scale-[0.99] transition-all duration-200
                    focus:outline-none
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none
                "
            >
                {updateProfileMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                        Guardando...
                    </span>
                ) : "Guardar Cambios"}
            </button>
        </form>
        </div>
    );
}
