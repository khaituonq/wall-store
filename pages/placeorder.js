import axios from 'axios';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';

const PlaceOrderScreen = () => {
    const { state, dispatch } = useContext(Store);
    const { cart } = state;
    const { cartItems, shippingAddress } = cart;

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

    const itemsPrice = round2(cartItems.reduce((a, c) => a + c.quantity * c.price, 0));
    const shippingPrice = itemsPrice > 200 ? 0 : 15;
    const totalPrice = round2(itemsPrice + shippingPrice);

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const placeOrderHandler = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post('/api/orders', {
                orderItems: cartItems,
                shippingAddress,
                itemsPrice,
                shippingPrice,
                totalPrice,
            });
            setLoading(false);
            dispatch({ type: 'CART_CLEAR_ITEMS' });
            Cookies.set('cart', JSON.stringify({ ...cart, cartItems: [] }));
            router.push(`/order/${data._id}`);
        } catch (err) {
            setLoading(false);
            toast.error(getError(err));
        }
    };

    return (
        <Layout title="Place Order">
            <CheckoutWizard activeStep={3} />
            <h1 className="mb-4 text-lg font-bold uppercase">Place Order</h1>
            {cartItems.length === 0 ? (
                <div>
                    Cart is empty. <Link href="/">Go shopping</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-4 md:gap-5">
                    <div className="overflow-x-auto md:col-span-3">
                        <div className="card p-5">
                            <h2 className="mb-2 text-lg font-medium">Shipping Address</h2>
                            <div>
                                {shippingAddress.fullName}, {shippingAddress.address}, {shippingAddress.city},{' '}
                                {shippingAddress.country}
                            </div>
                            <div>
                                <Link href="/shipping">
                                    <p className="cursor-pointer text-blue-700">Edit</p>
                                </Link>
                            </div>
                        </div>

                        <div className="card overflow-x-auto p-5">
                            <h2 className="mb-2 text-lg font-medium">Order Items</h2>
                            <table className="min-w-full">
                                <thead className="border-b">
                                    <tr>
                                        <th className="px-5 text-left">Item</th>
                                        <th className="p-5 text-right">Quantity</th>
                                        <th className="p-5 text-right">Price</th>
                                        <th className="p-5 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => (
                                        <tr key={item._id} className="borer-b">
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
                                            <td className="p-5 text-right">{item.quantity}</td>
                                            <td className="p-5 text-right">{item.price}</td>
                                            <td className="p-5 text-right">{item.quantity * item.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div>
                                <Link href="/cart">
                                    <p className="cursor-pointer text-blue-700">Edit</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="card p-5">
                        <h2 className="mb-2 text-lg font-bold">Order Summary</h2>
                        <ul>
                            <li>
                                <div className="mb-2 flex justify-between">
                                    <div className="font-medium">Items</div>
                                    <div>${itemsPrice}</div>
                                </div>
                            </li>
                            <li>
                                <div className="mb-2 flex justify-between">
                                    <div className="font-medium">Shipping</div>
                                    <div>${shippingPrice}</div>
                                </div>
                            </li>
                            <li>
                                <div className="mb-6 flex justify-between">
                                    <div className="font-medium">Total</div>
                                    <div>${totalPrice}</div>
                                </div>
                            </li>
                            <li>
                                <button
                                    disabled={loading}
                                    onClick={placeOrderHandler}
                                    className="primary-button w-full"
                                >
                                    {loading ? 'Loading...' : 'Place Order'}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </Layout>
    );
};

PlaceOrderScreen.auth = true;
export default PlaceOrderScreen;
