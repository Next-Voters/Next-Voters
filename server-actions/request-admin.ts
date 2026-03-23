"use server"

import { db } from "@/lib/db"

export default async function handleRequestAdmin(email: string, name: string) {
    if (!email?.trim() || !name?.trim()) {
        return "Please provide email and name"
    }

    const userExists = await db
        .selectFrom("user_admin_request")
        .select("email")
        .where("email", "=", email.trim())
        .executeTakeFirst()

    if (userExists) {
        return "User already exists"
    }
    
    await db
        .insertInto("user_admin_request")
        .values({
            email: email.trim(),
            name: name.trim()
        })
        .execute()
    return "User added successfully"
}
