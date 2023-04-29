import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import ListItems from '../../components/ListItems';
import { getError } from '../../utils/error';

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, users: action.payload, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true };
        case 'DELETE_SUCCESS':
            return { ...state, loadingDelete: false, successDelete: true };
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false };
        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false };
        default:
            state;
    }
}

export default function AdminOrderScreen() {
    const [{ loading, error, users }, dispatch] = useReducer(reducer, {
        loading: true,
        users: [],
        error: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/admin/users`);
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        fetchData();
    }, []);

    const deleteHandler = async (userId) => {
        if (!window.confirm('Are you sure?')) {
            return;
        }
        try {
            dispatch({ type: 'DELETE_REQUEST' });
            await axios.delete(`/api/admin/users/${userId}`);
            dispatch({ type: 'DELETE_SUCCESS' });
            toast.success('User deleted successfully');
        } catch (err) {
            dispatch({ type: 'DELETE_FAIL' });
            toast.error(getError(err));
        }
    };
    return (
        <Layout title="Admin Dashboard">
            <div className="grid md:grid-cols-4 md:gap-5">
                <ListItems />
                <div className="overflow-x-auto md:col-span-3">
                    <h1 className="mb-4 text-xl uppercase font-semibold">Admin Users</h1>

                    {loading ? (
                        <div className="font-medium">Loading...</div>
                    ) : error ? (
                        <div className="alert-error">{error}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="border-b">
                                    <tr>
                                        <th className="px-5 text-left">ID</th>
                                        <th className="p-5 text-left">USER</th>
                                        <th className="p-5 text-left">EMAIL</th>
                                        <th className="p-5 text-left">ACCESS</th>
                                        <th className="p-5 text-left">DATE CREATE</th>
                                        <th className="p-5 text-left">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id} className="border-b">
                                            <td className="p-5">{user._id.substring(20, 24)}</td>
                                            <td className="p-5">{user.name}</td>
                                            <td className="p-5">{user.email}</td>
                                            <td className="p-5">{user.isAdmin ? 'Admin' : 'User'}</td>
                                            <td className="p-5">{user.createdAt.substring(0, 10)}</td>
                                            <td className=" p-5 ">
                                                <button
                                                    onClick={() => deleteHandler(user._id)}
                                                    className="delete-button"
                                                    type="button"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

AdminOrderScreen.auth = { adminOnly: true };
