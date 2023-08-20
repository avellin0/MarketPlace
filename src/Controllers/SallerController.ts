import { Request, Response } from "express";
import { Client } from "../database/prisma_client";

export class SaleProduct {
    async handle(req: Request, res: Response) {

        try {

            const { products, userSellerId } = req.body;
            const { id } = req.user;

            const ProductByDateBase = await Client.product.findMany({
                where: {
                    id: { in: products.map((produto: any) => produto.id) }
                }
            })

            const ProductWithQuantity = ProductByDateBase.map((produto) => {
                const { id, name, price } = produto;

                const quantity = products.find((p: any) => p.id == produto.id).quantity;

                return {
                    id,
                    name,
                    price,
                    quantity,
                };
            });

            if (id === userSellerId) {
                return res.status(400).json({ message: "Usuario com mesmo ID" })
            }

            let total = 0;

            for (const product of ProductWithQuantity) {
                total += product.price * parseInt(product.quantity);
            }

            const sale = await Client.sale.create({
                data: {
                    total_value: total,
                    seller: { connect: { id: userSellerId } },
                    buyer: { connect: { id } },
                    SaleProduct: {

                        create: ProductWithQuantity.map((produto: any) => ({
                            Product: { connect: { id: produto.id } },
                            quantity: produto.quantity,
                        })),
                    },
                },
                include: {
                    SaleProduct: true
                }
            });


            ProductWithQuantity.map(async (produto) => {
                await Client.product.updateMany({
                    where: {
                        id: produto.id
                    },
                    data: {
                        amount: {
                            decrement: parseInt(produto.quantity)
                        }
                    }


                })
            })


            return res
                .status(201)
                .json(sale)

        } catch (err) {
            return res
                .status(400)
                .json(err)
        }
    }
}

export class GetUniqueByBuyer{
    async handle(req: Request, res: Response) {
        const { id } = req.user;

        const FoundSales = await Client.sale.findMany({
            where: {
                buyerId: id
            },
            select: {
                seller: {
                    select: {
                        id: true,
                        password: true,
                        name: true, 
                        email: true
                    }
                },
                buyer: {
                    select: {
                        id: true,
                        password: true,
                        email: true,
                        name: true

                    }
                },
                SaleProduct: {
                    select: {
                        quantity: true,
                        Product: {
                            select: {
                                id: true,
                                price: true,
                                name: true,
                            }
                        },
                    }
                },
                creat_at: true

            }
        })

        return res.json(FoundSales)
    }
}

export class GetUniqueBySeller{
    async handle(req: Request, res: Response) {
        const { id } = req.user;

        const FoundSales = await Client.sale.findMany({
            where: {
                sellerId: id
            },
            select: {
                seller: {
                    select: {
                        id: true,
                        password: true,
                        name: true, 
                        email: true
                    }
                },
                buyer: {
                    select: {
                        id: true,
                        password: true,
                        email: true,
                        name: true

                    }
                },
                SaleProduct: {
                    select: {
                        quantity: true,
                        Product: {
                            select: {
                                id: true,
                                price: true,
                                name: true,
                            }
                        },
                    }
                },
                creat_at: true

            }
        })

        return res.json(FoundSales)
    }
}

export class GetAllSale {
    async handle(req: Request, res: Response) {

        const FoundSales = await Client.sale.findMany({
            select: {
                id: true,
                total_value: true,
                seller: {
                    select: {
                        id: true,
                        password: true,
                        name: true,
                        email: true
                    }
                },
                buyer: {
                    select: {
                        id: true,
                        password: true,
                        email: true,
                        name: true

                    }
                },
                SaleProduct: {
                    select: {
                        quantity: true,
                        Product: {
                            select: {
                                id: true,
                                price: true,
                                name: true,
                            }
                        },
                    }
                },
                creat_at: true

            }
        })

        return res.json(FoundSales)
    }
}