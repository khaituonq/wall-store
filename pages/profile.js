import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSession, signIn } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils/error';
import Layout from '../components/Layout';

const ProfileScreen = () => {
    const { data: session } = useSession();
    const {
        handleSubmit,
        register,
        getValues,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        setValue('name', session.user.name);
        setValue('email', session.user.email);
    }, [session.user.email, session.user.name, setValue]);

    const submitHandler = async ({ name, email, password }) => {
        try {
            await axios.put('/api/auth/update', {
                name,
                email,
                password,
            });
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });
            toast.success('Profile updated successfully');
            if (result.error) {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error(getError(error));
        }
    };
    return (
        <Layout title="Profile">
            <form className="mx-auto max-w-screen-md" onSubmit={handleSubmit(submitHandler)}>
                <h1 className="mb-4 text-xl uppercase font-medium">Update Profile</h1>
                <div className="mb-4">
                    <label htmlFor="name">Name</label>
                    <input
                        type="name"
                        className="w-full"
                        id="name"
                        autoFocus
                        {...register('name', { required: 'Please enter name' })}
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
                <div className="mb-8">
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
                    <button className="primary-button">Update Profile</button>
                </div>
            </form>
        </Layout>
    );
};

ProfileScreen.auth = true;
export default ProfileScreen;
