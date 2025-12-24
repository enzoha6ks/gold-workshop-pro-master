import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

export async function verifyAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return null;
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      organizationId: string;
      email: string;
    };

    return decoded;
  } catch (error) {
    console.error("Auth verification failed:", error);
    return null;
  }
}