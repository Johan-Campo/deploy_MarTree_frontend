import React from 'react';
import { useForm } from 'react-hook-form';
import slugify from 'react-slugify';
import { useMutation } from '@tanstack/react-query';
import { Link as LinkIconLucide, CircleCheck, ArrowRight, CircleAlert } from 'lucide-react';
import styles from './UsernameSection.module.css';
import animationStyles from '../styles/animations.module.css';
import { searchByHandle } from '../api/MarTreeApi';
import { Link } from 'react-router-dom';

interface FormValues {
    handle: string;
}

export const UsernameSection: React.FC = () => {
    const { register, handleSubmit, watch, reset } = useForm<FormValues>({
        defaultValues: { handle: '' }
    });

    const mutation = useMutation({ mutationFn: searchByHandle });

    const handleValue = watch('handle');
    const slug = slugify(handleValue || '');
    const isActive = slug.length > 0;

    const onSubmit = (data: FormValues) => {
        mutation.mutate(slugify(data.handle));
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={`${styles.container} ${animationStyles.fadeUp} ${animationStyles.delay400}`}
        >
            {/* Input */}
            <div className={`${styles.inputWrapper} ${mutation.isError ? styles.inputError : ''} ${mutation.isSuccess ? styles.inputSuccess : ''}`}>
                <LinkIconLucide className={styles.inputIcon} />
                <span className={styles.prefix}>martree.com/</span>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="tu-martree"
                    autoComplete="off"
                    spellCheck={false}
                    {...register('handle', {
                        required: true,
                        onChange: () => {
                            if (mutation.isSuccess || mutation.isError) mutation.reset();
                        }
                    })}
                />
            </div>

            {/* Success */}
            {mutation.isSuccess && (
                <div className={`${styles.successCard} ${animationStyles.scaleIn}`}>
                    <CircleCheck className={styles.successIcon} />
                    <span className={styles.successText}>
                        <strong>@{slug}</strong> está disponible
                    </span>
                    <Link
                        to="/auth/register"
                        state={{ handle: slug }}
                        className={styles.successLink}
                        onClick={() => reset()}
                    >
                        Crear cuenta
                        <ArrowRight className={styles.successArrow} />
                    </Link>
                </div>
            )}

            {/* Error */}
            {mutation.isError && (
                <div className={`${styles.errorCard} ${animationStyles.scaleIn}`}>
                    <CircleAlert className={styles.errorIcon} />
                    <span className={styles.errorText}>
                        {(mutation.error as Error).message}
                    </span>
                </div>
            )}

            {/* CTA button — always visible, no entry animation */}
            <button
                type="submit"
                className={`${styles.button} ${isActive ? styles.buttonActive : ''}`}
                disabled={!isActive || mutation.isPending}
            >
                {mutation.isPending
                    ? <span className={styles.spinner} />
                    : 'Obtener mi MarTree'
                }
            </button>
        </form>
    );
};
