import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and new password are required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if account exists
    const user = await prisma.participantUser.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "No account found with this email address" }, { status: 404 });
    }

    // Hash the new password
    const passwordHash = bcrypt.hashSync(password, 12);

    // Update password
    await prisma.participantUser.update({
      where: { email: cleanEmail },
      data: { password_hash: passwordHash },
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
