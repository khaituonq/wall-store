import { getSession } from 'next-auth/react';
import User from '../../../../../models/User';
import db from '../../../../../utils/db';

const handler = async (req, res) => {
    const session = await getSession({ req });
    if (!session || (session && !session.user.isAdmin)) {
        return res.status(401).send('signin required');
    }
    if (req.method === 'GET') {
        await db.connect();
        const users = await User.find({}).populate('name', 'email');
        await db.disconnect();
        res.send(users);
    } else if (req.method === 'DELETE') {
        return deleteHandler(req, res);
    } else {
        return res.status(400).send({ message: 'Method not allowed' });
    }
};

const deleteHandler = async (req, res) => {
    await db.connect();
    const user = await User.findById(req.query.id);
    if (user) {
        await user.remove();
        await db.disconnect();
        res.send({ message: 'Product deleted successfully' });
    } else {
        await db.disconnect();
        res.status(404).send({ message: 'Product not found' });
    }
};
export default handler;
