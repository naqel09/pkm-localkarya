import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

interface JWTPayload {
    userId: number;
    username: string;
    role: string;
    iat: number;
    exp: number;
}

export async function checkServerAuth(): Promise<JWTPayload | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;

        if (!token) {
            return null;
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "localkarya-secret-key"
        ) as JWTPayload;

        return decoded;
    } catch (error) {
        console.error("Server auth check error:", error);
        return null;
    }
}

export async function requireAuth(): Promise<JWTPayload> {
    const user = await checkServerAuth();
    
    if (!user) {
        redirect("/admin");
    }
    
    return user;
}
