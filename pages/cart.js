import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { BiXCircle } from 'react-icons/bi';
import dynamic from 'next/dynamic';
import axios from 'axios';

import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import { toast } from 'react-toastify';
import { FaHandPointRight } from 'react-icons/fa';

const CartScreen = () => {
    const { state, dispatch } = useContext(Store);
    const {
        cart: { cartItems },
    } = state;
    const router = useRouter();

    const removeItemHandler = (item) => {
        dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    };

    const updateCartHandler = async (item, qty) => {
        const quantity = Number(qty);
        const { data } = await axios.get(`/api/products/${item._id}`);
        if (data.countInStock < quantity) {
            return toast.error('Sorry. Product is out of stock');
        }
        dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
        toast.success('Product updated in the cart');
    };
    return (
        <Layout title="Shopping Cart">
            <h1 className="mb-4 text-lg font-bold uppercase ml-[10%] -tracking-tighter">Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div className="mt-10">
                    <p className="text-red-500">Cart is empty.</p>
                    <Link href="/">
                        <p className="text-gray-700 font-semibold text-xl hover:text-gray-900 cursor-pointer flex flex-row items-center">
                            <FaHandPointRight className="mr-2" />
                            Go shopping
                        </p>
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-4 md:gap-5">
                    <div className="overflow-x-auto md:col-span-3">
                        <table className="min-w-full">
                            <thead className="border-b">
                                <tr>
                                    <th className="px-5 text-left">Item</th>
                                    <th className="p-5 text-right">Quantity</th>
                                    <th className="p-5 text-right">Price</th>
                                    <th className="p-5">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => (
                                    <tr key={item.slug} className="border-b">
                                        <td>
                                            <Link href={`/product/${item.slug}`}>
                                                <a className="flex items-center">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={50}
                                                        height={50}
                                                    ></Image>
                                                    &nbsp;
                                                    {item.name}
                                                </a>
                                            </Link>
                                        </td>
                                        <td className="p-5 text-right">
                                            <select
                                                value={item.quantity}
                                                onChange={(e) => updateCartHandler(item, e.target.value)}
                                            >
                                                {[...Array(item.countInStock).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-5 text-right">${item.price}</td>
                                        <td className="p-5 text-center">
                                            <button type="button" onClick={() => removeItemHandler(item)}>
                                                <BiXCircle className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="card p-5">
                        <ul>
                            <li>
                                <div className="pb-3 text-lg font-bold ">
                                    <h1 className="uppercase flex justify-center mb-10 text-xl">Order summary</h1>
                                    <div className="flex justify-between">
                                        <p>Items:</p>
                                        <p className="text-xl text-red-500">
                                            ({cartItems.reduce((a, c) => a + c.quantity, 0)})
                                        </p>
                                    </div>
                                    <div className="flex justify-between mb-10">
                                        <p>Subtotal:</p>{' '}
                                        <p className="font-medium">
                                            ${cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                                        </p>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <button
                                    className="primary-button w-full"
                                    onClick={() => router.push('login?redirect=/shipping')}
                                >
                                    Check Out
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
