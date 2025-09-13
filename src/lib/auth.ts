import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export interface JWTPayload {
    userId: number;
    username: string;
    role: string;
    iat: number;
    exp: number;
}

export function verifyToken(token: string): JWTPayload | null {
    try {
        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET || "localkarya-secret-key"
        ) as JWTPayload;
        return decoded;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
}

export async function getAuthUser(): Promise<JWTPayload | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;
        
        if (!token) {
            return null;
        }

        return verifyToken(token);
    } catch (error) {
        console.error("Error getting auth user:", error);
        return null;
    }
}

export async function isAuthenticated(): Promise<boolean> {
    const user = await getAuthUser();
    return user !== null;
}
