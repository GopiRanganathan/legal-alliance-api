import { Request, Response, Router } from "express";
import UserModel from "../data/schema/user";
import AccountModel from "../data/schema/account";
import bcrypt from "bcrypt";

const AccountRouter = Router()

AccountRouter.post('/register', async (req: Request, res: Response) => {
    try {
        let userInfo = req.body
        let isAccountExist = await UserModel.find({ email: userInfo.email })
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

export default AccountRouter;