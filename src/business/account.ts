import axios from "axios";
import OtpModel from "../data/schema/otp";
import { Twilio } from "twilio";
import AccountModel from "../data/schema/account";
const nodemailer = require("nodemailer");

class AccountManager {

    generateOTP() {
        return Math.floor(10000 + Math.random() * 90000).toString();
    }

    saveOTP(type: string, email?: string, phoneNumber?: string) {
        return new Promise<void>(async (resolve, reject) => {
            try {
                let otp = this.generateOTP()
                const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
                if (type == "email" && email) {
                    await OtpModel.deleteMany({ email: email })
                    await OtpModel.create({ email: email, code: otp, expiresAt: expiresAt });
                    await this.sendMail(otp, email)
                }
                else if (phoneNumber) {
                    await OtpModel.deleteMany({ phoneNumber: phoneNumber })
                    await OtpModel.create({ phoneNumber: phoneNumber, code: 11111, expiresAt: expiresAt });
                    // await this.sendSMS(otp, phoneNumber)
                }
                resolve()
            }
            catch (error) {
                reject(error)
            }
        })
    }

    sendMail(otp: string, email: string) {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });

                await transporter.sendMail({
                    from: `"Legal alliance" <${process.env.EMAIL_USER}>`,
                    to: email,
                    subject: 'Your OTP Code',
                    html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
                });
                resolve()
            }
            catch (error) {
                reject(error)
            }
        })
    }

    //fast2sms
    // sendSMS(otp: string, phoneNumber: string) {
    //     return new Promise<void>(async (resolve, reject) => {
    //         try {
    //             const response = await axios.post(
    //                 'https://www.fast2sms.com/dev/bulkV2',
    //                 {
    //                     variables_values: otp,
    //                     route: 'otp',
    //                     numbers: phoneNumber,
    //                 },
    //                 {
    //                     headers: {
    //                         authorization: process.env.SMS_APIKEY,
    //                     },
    //                 }
    //             );
    //             if (response.status == 200) {
    //                 resolve()
    //             }
    //         }
    //         catch (error) {
    //             reject(error)
    //         }
    //     })
    // }

    //twilio
    sendSMS(otp: string, phoneNumber: string) {
        return new Promise<void>(async (resolve, reject) => {
            try {

                const accountSid = process.env.TWILIO_ACCOUNT_SID!;
                const authToken = process.env.TWILIO_AUTH_TOKEN!;
                const client = new Twilio(accountSid, authToken);
                const message = await client.messages.create({
                    body: `Your OTP is ${otp}`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: `+91${phoneNumber}`, // Must be in E.164 format, like +919876543210
                });

                if (message.status) {
                    resolve()
                }
            }
            catch (error) {
                reject(error)
            }
        })
    }

    verifyOTP(type: string, otp: string, email?: string, phoneNumber?: string) {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                if (type == "email" && email) {
                    let savedOTP = await OtpModel.findOne({ email: email, code: otp })
                    if (savedOTP && savedOTP?.expiresAt < new Date()) {
                        await OtpModel.deleteOne({ _id: savedOTP?._id })
                        resolve(false)
                    }
                    else if (savedOTP) {
                        await OtpModel.deleteOne({ _id: savedOTP?._id })
                        await AccountModel.updateOne({ email: email }, { $set: { emailVerified: true } })
                        resolve(true)
                    }
                    else {
                        resolve(false)
                    }
                }
                else if (type == "phone number" && phoneNumber) {
                    let savedOTP = await OtpModel.findOne({ phoneNumber: phoneNumber, code: otp })
                    if (savedOTP && savedOTP?.expiresAt < new Date()) {
                        await OtpModel.deleteOne({ _id: savedOTP?._id })
                        resolve(false)
                    }
                    else if (savedOTP) {
                        await OtpModel.deleteOne({ _id: savedOTP?._id })
                        await AccountModel.updateOne({ phoneNumber: phoneNumber }, { $set: { phoneVerified: true } })
                        resolve(true)
                    }
                    else {
                        resolve(false)
                    }
                }

            }
            catch (error) {
                reject(error)
            }
        })
    }
}

export default AccountManager