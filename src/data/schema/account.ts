import { model, Schema } from "mongoose";

const AccountSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    phoneNumber: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },

    phoneVerified: {
        type: Boolean,
        default: false,
    },
},
    {
        timestamps: true,
    })

const AccountModel = model("account", AccountSchema)

export default AccountModel;