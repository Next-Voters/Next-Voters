import { NextRequest, NextResponse } from "next/server"
import { transporter } from "@/lib/nodemailer"

export const sendConfirmationEmail = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: `Next Voters NO-REPLY`,
      to: email,
      subject: "Confirmation Email",
      text: "Thank you for signing up to Next Voters Line!",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    )
  }
}
