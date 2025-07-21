import { Request, Response, Router } from "express";
import UserModel from "../data/schema/user";
import AccountModel from "../data/schema/account";
import bcrypt from "bcrypt";
import AccountManager from "../business/account";

const AccountRouter = Router()

AccountRouter.post('/register', async (req: Request, res: Response) => {
    try {
        let userInfo = req.body
        let isAccountExist = await UserModel.find({ email: { $regex: `^${userInfo.email}$`, $options: 'i' } })
        if (isAccountExist?.length > 0) {
            res.status(417).send({
                domain: 'account',
                field: 'email',
                issue: 'exist',
                message: "email account already exist"
            })
        }
        else {
            let newUser = new UserModel({
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                email: userInfo.email,
                phoneNumber: userInfo.phoneNumber,
                role: userInfo.role,
                address: userInfo.address,
                pincode: userInfo.pincode
            })
            let savedUser = await newUser.save()
            let hashedPassword = await bcrypt.hash(userInfo.password, 10)

            let newAccount = new AccountModel({
                email: userInfo.email,
                password: hashedPassword,
                user: savedUser._id
            })

            await newAccount.save()
            res.status(200).send(savedUser)
        }
    }
    catch (error) {
        res.status(417).send({
            domain: 'account',
            issue: 'unknown',
            hint: error
        })
    }
})

AccountRouter.post('/sendotp', async (req: Request, res: Response) => {
    try {
        let verificationType = req.body.type
        if (verificationType == 'email') {
            let email = req.body.email
            await new AccountManager().saveOTP(verificationType, email)
            res.status(200).send({
                message: 'otp send successfully'
            })
        }
        else {
            let phoneNumber = req.body.phoneNumber
            await new AccountManager().saveOTP(verificationType, undefined, phoneNumber)
            res.status(200).send({
                message: 'otp send successfully'
            })
        }
    }
    catch (error) {
        res.status(417).send({
            domain: 'otp',
            issue: 'unknown',
            hint: error
        })
    }
})

AccountRouter.post('/verifyotp', async (req: Request, res: Response) => {
    try {
        let verificationType = req.body.type
        let otp = req.body.otp
        if (verificationType == 'email') {
            let email = req.body.email
            let isVerified = await new AccountManager().verifyOTP(verificationType, otp, email)
            if (isVerified) {
                res.status(200).send({
                    message: 'email otp verification successful'
                })
            }
            else {
                res.status(417).send({
                    domain: 'otp',
                    issue: 'invalid',
                })
            }
        }
        else {
            let phoneNumber = req.body.phoneNumber
            let isVerified = await new AccountManager().verifyOTP(verificationType, otp, undefined, phoneNumber)
            if (isVerified) {
                res.status(200).send({
                    message: 'email otp verification successful'
                })
            }
            else {
                res.status(417).send({
                    domain: 'otp',
                    issue: 'invalid',
                })
            }
        }
    }
    catch (error) {
        res.status(417).send({
            domain: 'otp',
            issue: 'unknown',
            hint: error
        })
    }
})

export default AccountRouter;