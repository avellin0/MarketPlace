import { Request, Response } from "express";
import { Client } from "../database/prisma_client";

export class DeleteUser {
    async handle(req: Request, res: Response) {
        try {
            await Client.user.deleteMany()
            return res.status(200).json({ message: "Geral Foi de Base" })
        } catch (error) {
            return res
                .status(400)
                .json(error)
        }
    }
}

export class DeleteStore {
    async handle(req: Request, res: Response) {
        try {
            await Client.store.deleteMany()
            return res.status(200).json({ message: "Geral Foi de Base" })
        } catch (error) {
            return res
                .status(400)
                .json(error)
        }
    }
}


export class DeleteProducts {
    async handle(req: Request, res: Response) {
        try {
            await Client.product.deleteMany()
            return res.status(200).json({ message: "Geral Foi de Base" })
        } catch (error) {
            return res
                .status(400)
                .json(error)
        }
    }
}