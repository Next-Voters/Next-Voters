import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jsonwebtoken from 'jsonwebtoken'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    throw new Error('Missing token parameter.')
  }

  const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET as string, async (err, decoded) => {
    if (err) {
      throw new Error('Invalid token.')
    }
    return decoded
  })

  const contact = (decoded as { contact: string }).contact

  try {
    await db
      .deleteFrom('subscriptions')
      .where('contact', '=', contact)
      .execute()

    return NextResponse.json({
      message: 'You have been unsubscribed from Civic Line.',
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Database error.' },
      { status: 500 }
    )
  }
}
