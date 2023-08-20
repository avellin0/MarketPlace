import { Request, Response } from "express"
import { Client } from "../database/prisma_client"

export class UpdateProducts {
    async handle(req: Request, res: Response) {

        try {

            const { name, price, amount } = req.body;
            const { productId } = req.params;
            const { id } = req.user;


            const loja = await Client.product.update({
                where: {
                    id: productId
                },
                data: {
                    amount,
                    name,
                    price,

                }
            })

            return res.status(200).json(loja)

        } catch (error) {
            return res
                .status(400)
                .json(error)
        }
    }
}


export class GetAllProducts {
    async handle(req: Request, res: Response) {
        try {
            const GetProducts = await Client.product.findMany({
                select: {
                    id: true,
                    name: true,
                    price: true,
                    amount: true,
                    Store: {
                        select: {
                            name: true
                        }
                    },

                }
            })

            return res.status(200).json(GetProducts)

        } catch (error) {
            return res
                .status(400)
                .json(error)
        }
    }
}