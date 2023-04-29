import Link from 'next/link';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import Layout from '../components/Layout';
import { getError } from '../utils/error';
import axios from 'axios';

const LoginScreen = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const { redirect } = router.query;

    useEffect(() => {
        if (session?.user) {
            router.push(redirect || '/');
        }
    }, [router, session, redirect]);
    const {
        register,
        getValues,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const submitHandler = async ({ name, email, password }) => {
        try {
            await axios.post('/api/auth/signup', {
                name,
                email,
                password,
            });
            const result = await signIn('credentials', { redirect: false, email, password });
            if (result.error) {
                toast.error(result.error);
            }
        } catch (err) {
            toast.error(getError(err));
        }
    };
    return (
        <Layout title="create Account">
            <form className="mx-auto max-w-screen-md" onSubmit={handleSubmit(submitHandler)}>
                <h1 className="mb-4 text-xl">Create Account</h1>
                <div className="mb-4">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        autoFocus
                        className="w-full"
                        {...register('name', {
                            required: 'Please enter name',
                        })}
                    />
                    {errors.name && <div className="text-red-500">{errors.name.message}</div>}
                </div>
                <div className="mb-4">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="w-full"
                        {...register('email', {
                            required: 'Please enter email',
                            pattern: {
                                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                                message: 'Please enter valid email  ',
                            },
                        })}
                    />
                    {errors.email && <div className="text-red-500">{errors.email.message}</div>}
                </div>
                <div className="mb-4">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        autoFocus
                        className="w-full"
                        {...register('password', {
                            required: 'Please enter password',
                            minLength: { value: 6, message: 'Password is more than 5 chars' },
                        })}
                    />
                    {errors.password && <div className="text-red-500">{errors.password.message}</div>}
                </div>
                <div className="mb-4">
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="w-full"
                        {...register('confirmPassword', {
                            required: 'Please enter confirm password',
                            validate: (value) => value === getValues('password'),
                            minLength: { value: 6, message: 'Confirm password is more than 5 chars' },
                        })}
                    />
                    {errors.confirmPassword && <div className="text-red-500">{errors.confirmPassword.message}</div>}
                    {errors.confirmPassword && errors.confirmPassword.type === 'validate' && (
                        <div className="text-red-500">Password do not match</div>
                    )}
                </div>
                <div className="mb-4">
                    <button className="primary-button">Register</button>
                </div>
                <div className="mb-4">
                    Don&apos;t have an account? &nbsp;
                    <Link href={`/register?redirect=${redirect || '/'}`}>Register</Link>
                </div>
            </form>
        </Layout>
    );
};

export default LoginScreen;
