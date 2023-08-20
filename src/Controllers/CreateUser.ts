import { Request, Response } from "express";
import { Client } from "../database/prisma_client";
import { hash } from "bcryptjs";

export class CreateUser {
    async handle(req: Request, res: Response) {
        try {


            const { name, password, email, accessName } = req.body;

            const emailExiste = await Client.user.findUnique({
                where: {
                    email
                }
            })

            const acessoValido = await Client.access.findUnique({
                where: {
                    name: accessName
                }
            })

            if (!acessoValido) {
                return res.status(400).json({ message: "Acesso não está Disponivel" })
            }

            if (emailExiste) {
                return res.status(400).json({ message: "Email já cadastrado" })
            }

            const HashPassword = await hash(password, 8)

            const usuario = await Client.user.create({
                data: {
                    email,
                    password: HashPassword,
                    name,
                    UserAccess: {
                        create: {
                            Access: {
                                connect: {
                                    name: accessName
                                }
                            }
                        }
                    },
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    UserAccess: {
                        select: {
                            Access: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            })
            return res.status(200).json(usuario)
        }
        catch (error) {
            return res
                .status(400)
                .json(error)
        }
    }
}



export class GetAllUsers {
    async handle(req: Request, res: Response) {
        try {
            const users = await Client.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    UserAccess:
                    {
                        select:
                        {
                            Access:
                            {
                                select:
                                {
                                    name: true
                                }
                            }
                        }
                    }
                }
            })

            if (!users) {
                return res.status(204).json({ message: "Usuario Não existente" })
            }

            return res.status(201).json(users)
        }
        catch (error) {
            return res
                .status(400)
                .json(error)
        }
    }
}

export class GetUniqueUsers {
    async handle(req: Request, res: Response) {
        try {
            const { id } = req.user

            const users = await Client.user.findUnique({
                where: {
                    id
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    UserAccess: {
                        select: {
                            Access: {
                                select: {
                                    name: true,
                                }
                            },
                        },
                    },
                    Store: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                }
            })
            if (!users) {
                return res.status(204).json({ message: "Usuario Não existente" })
            }

            return res.status(201).json(users)
        }
        catch (error) {
            return res
                .status(400)
                .json(error)
        }
    }
}