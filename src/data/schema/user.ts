import { model, Schema } from "mongoose";

const UserSchema = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    role: {
        type: String,
        enum: ['admin', 'service provider', 'client']
    },
    barLicenseNumber: {
        type: String
    },
    experience: {
        type: Number
    },
    // expertise:{
    //     type: String,
    //     enum: ['advocate', ]
    // },
    address: {
        type: String
    },
    pincode: {
        type: String
    }
},  {
    timestamps: true,
  })

const UserModel = model('user', UserSchema)
export default UserModel