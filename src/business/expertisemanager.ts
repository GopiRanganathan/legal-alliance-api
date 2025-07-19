import ExpertiseModel from "../data/schema/expertise";

const fs = require('fs');
const path = require('path');

class ExpertiseManager {
    import() {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const filePath = path.join("data", "expertise", "index.json")
                const data = await fs.readFileSync(filePath, 'utf-8');
                const expertiseList = JSON.parse(data);
                let expertiseExist = await ExpertiseModel.find()
                if (expertiseExist.length === 0) {
                    for await (const element of expertiseList) {
                        let newExpertise = new ExpertiseModel(element)
                        await newExpertise.save()
                    }
                }
                resolve()
            }
            catch (error) {
                reject(error)
            }
        })

    }
}

export default ExpertiseManager;