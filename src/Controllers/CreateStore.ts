import { Request, Response } from "express"
import { Client } from "../database/prisma_client"

export class CreateStore {
    async handle(req: Request, res: Response) {
        try {
            const { name } = req.body;
            const { id } = req.user;


            const user_exist = await Client.user.findUnique({
                where: {
                    id
                }
            })

            if (!user_exist) {
                return res.status(400).json({ message: "Usuario não existe!" })
            }

            const loja = await Client.store.create({
                data: {
                    name,
                    User: {
                        connect: {
                            id
                        }
                    }
                }
            })

            return res.json(loja)
        } catch (error) {
            return res
                .status(400)
                .json(error)
        }
    }
}


export class GetAllStore {
    async handle(req: Request, res: Response) {
        try {
            const GetProducts = await Client.store.findMany({
                select: {
                    id: true,
                    name: true,
                    User: {
                        select: {
                            name: true
                        }
                    },
                    product: {
                        select: {
                            name: true,
                            price: true,
                            amount: true
                        }
                    }
                }
            })

            return res.status(200).json(GetProducts);

        } catch (error) {
            return res
                .status(400)
                .json(error)
        }
    }
}

