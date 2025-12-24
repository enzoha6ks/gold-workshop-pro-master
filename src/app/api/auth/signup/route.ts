import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { workshopName, email, password } = await req.json();

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create BOTH Organization and User in one "Transaction"
    const newUser = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: { name: workshopName },
      });

      return tx.user.create({
        data: {
          email,
          password: hashedPassword,
          organizationId: org.id,
          role: "ADMIN",
        },
      });
    });

    return NextResponse.json({ message: "Workshop created successfully!" }, { status: 201 });
  } catch (error) {
    console.error("SIGNUP_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}