import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/libs/prismadb';
import serverAuth from "@/libs/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const { postId } = req.query;
            if (!postId || typeof postId !== 'string') {
                throw new Error("Invalid ID");
            }

            const post = await prisma.post.findUnique({
                where: {
                    id: postId
                },
                include: {
                    user: true,
                    comments: {
                        include: {
                            user: true
                        },
                        orderBy: {
                            createdAt: 'desc'
                        }
                    }
                }
            });

            return res.status(200).json(post);
        } catch (error) {
            console.log(error);
            return res.status(400).end();
        }
    }
    else if (req.method === 'DELETE') {
        try {
            const { postId } = req.query;
            if (!postId || typeof postId !== 'string') {
                throw new Error("Invalid ID");
            }

            // Kullanıcı doğrulaması
            const { currentUser } = await serverAuth(req, res);
            if (!currentUser) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            // Gönderiyi bul
            const post = await prisma.post.findUnique({
                where: { id: postId },
            });

            // Gönderi var mı ve mevcut kullanıcı gönderinin sahibi mi kontrol et
            if (!post || post.userId !== currentUser.id) {
                return res.status(403).json({ error: "Forbidden" });
            }

            // Gönderiyi sil
            await prisma.post.delete({ where: { id: postId } });
            return res.status(200).json({ message: "Post deleted successfully" });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ error: "An error occurred while deleting the post" });
        }
    }
    else {
        // Diğer metodlar için 405 Method Not Allowed hatası
        return res.status(405).end();
    }
}
