import { model, Schema } from "mongoose";

const OtpSchema = new Schema({
    email: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    code: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
})

OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OtpModel = model('otp', OtpSchema)
export default OtpModel