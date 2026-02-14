import React from 'react';
import { useForm } from 'react-hook-form';
import slugify from 'react-slugify';
import { useMutation } from '@tanstack/react-query';
import styles from './UsernameSection.module.css';
import animationStyles from '../styles/animations.module.css';
import { searchByHandle } from '../api/MarTreeApi';
import { Link } from 'react-router-dom';

interface FormValues {
    handle: string;
}

export const UsernameSection: React.FC = () => {

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<FormValues>({
        defaultValues: {
            handle: ''
        }
    });

    const mutation = useMutation({
        mutationFn: searchByHandle
    })

    const handleValue = watch('handle');
    const isButtonActive = handleValue.length > 0;

    const onSubmit = (data: FormValues) => {
        const slug = slugify(data.handle);
        mutation.mutate(slug);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={`${styles.container} ${animationStyles.slideInRight} ${animationStyles.delay500}`}
        >
            <div className={styles.inputWrapper}>
                <span className={styles.prefix}>martree.com/</span>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="tu MarTree"
                    {...register('handle', { required: true })}
                />
            </div>

            <div>
                {errors.handle && <p className={styles.error}>{errors.handle.message}</p>}
            </div>

            <div className='mt-10'>
                {mutation.isPending && <p className={styles.loading}>Buscando...</p>}
                {mutation.isError && (
                    <p className={styles.error}>
                        {(mutation.error as Error).message}
                    </p>
                )}
                {mutation.isSuccess && mutation.data && (
                    <p className={styles.success}>
                        ¡Disponible! <Link to={"/auth/register"} state={{ handle: slugify(handleValue) }} className='text-blue-500 hover:underline'>Crear cuenta</Link>
                    </p>
                )}
            </div>

            <button
                type="submit"
                className={`${styles.button} ${isButtonActive ? styles.buttonActive : ''} ${animationStyles.scaleIn} ${animationStyles.delay700}`}
                disabled={!isButtonActive}
            >
                Obtener mi MarTree
            </button>
        </form>
    );
};