import { Request, Response, Router } from "express";
import ExpertiseModel from "../data/schema/expertise";

const ExpertiseRouter = Router()

ExpertiseRouter.get('/expertise', async ( req:Request, res:Response) => {
    try{
        let allExpertise = await ExpertiseModel.find()
        res.status(200).send(allExpertise)
    }
    catch(error){
        res.status(417).send({
            domain:'expertise',
            issue: 'unknown',
            hint: error
        })
    }
})

export default ExpertiseRouter
