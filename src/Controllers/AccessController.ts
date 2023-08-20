import { Request, Response } from "express";
import { Client } from "../database/prisma_client";

export class CreateAccess {
    async handle(req: Request, res: Response) {
        try {
            const { name } = req.body;

            const acesso = await Client.access.create({
                data: {
                    name
                },
            })

            return res.status(200).json(acesso);
        } catch (error) {
            return res
                .status(400)
                .json(error)
        }
    }

}

export class GetAllAccess {
    async handle(req: Request, res: Response) {
        try {
            const { name } = req.body

            const GetAllAccess = await Client.access.findMany()

            return res.status(200).json(GetAllAccess);

        } catch (error) {
            return res
                .status(400)
                .json(error)
        }
    }
}
