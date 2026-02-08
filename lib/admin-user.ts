import { db } from "./db"

export const handleGetUser = async (email: string) => {
    const row = await db
        .selectFrom("admin_table")
        .selectAll()
        .where('email', '=', email)
        .executeTakeFirst() 

    return row ?? null
}