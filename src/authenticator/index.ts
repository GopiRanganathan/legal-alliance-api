import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import AccountModel from "../data/schema/account";


const Authenticator: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }
    else {
        const token = authHeader.split(' ')[1];

        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRETKEY as string);
            let account = await AccountModel.findOne({ email: decoded.email })
            if (account) {
                next();
            }
            else {
                res.status(401).send({ domain: 'auth', field: 'token', issue: 'invalid' });
            }
        } catch (error) {
            res.status(417).send({ domain: 'auth', field: 'token', issue: 'unknown', hint: error });
        }
    }


}

export default Authenticator;