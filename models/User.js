import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: { type: String, require: true },
        email: { type: String, require: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, required: true, default: false },
    },
    { timestamps: true },
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
