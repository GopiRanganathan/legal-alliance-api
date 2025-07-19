import { model, Schema } from "mongoose";

const ExpertiseSchema = new Schema({
    name:{
        type:String,
        required: true
    }
}, {
    timestamps: true,
  })

const ExpertiseModel = model('expertise', ExpertiseSchema)
export default ExpertiseModel