import { Request, Response, Router } from "express";
const fs = require("fs");
const path = require("path");

const BNSRouter = Router();

BNSRouter.get("/download", async (req: Request, res: Response) => {
  try {
    const filePath = path.join("pdf", "bns.pdf");
    res.status(200).download(filePath);
  } catch (error) {
    res.status(417).send({
      domain: "bns",
      issue: "unknown",
      hint: error,
    });
  }
});

export default BNSRouter;
