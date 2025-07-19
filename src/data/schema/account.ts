import { model, Schema } from "mongoose";

const AccountSchema = new Schema({
    email: {
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
    }
},
 {
    timestamps: true,
  })

const AccountModel = model("account", AccountSchema)

export default AccountModel;