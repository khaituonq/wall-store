import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const ListItems = () => {
    const location = useRouter();
    const path = location.asPath;
    return (
        <div>
            <ul>
                {['dashboard', 'orders', 'products', 'users'].map((item) => (
                    <li key={item}>
                        <Link href={`/admin/${item}`}>
                            <a className={path === `/admin/${item}` ? 'font-bold' : ''}>
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListItems;
