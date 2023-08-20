import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { Client } from "../database/prisma_client";

interface DecodedToken {
    userId: string;
}

export function authMiddleware(permissions?: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {

        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "token não informado!" })
        }

        const token = authHeader.substring(7)


        try {

            const MY_SECRET_KEY = process.env.MY_SECRET_KEY;

            if (!MY_SECRET_KEY) {
                throw new Error("Chave Secreta não fornecida!")
            }

            const decodedToken = verify(token, MY_SECRET_KEY) as DecodedToken

            req.user = { id: decodedToken.userId };

            if (permissions) {
                const user = await Client.user.findUnique({
                    where: {
                        id: decodedToken.userId
                    },
                    include: {
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
                });

                const userPermission = user?.UserAccess.map((na) => na.Access?.name) ?? []
                const hasPermission = permissions.some((p) => userPermission.includes(p))

                if (!hasPermission) {
                    return res.status(403).json({ message: "permissão negada." })
                }
            }

            return next()

        } catch (error) {
            return res.status(401).json({ message: "Token Inválido"})
        }

    }
}