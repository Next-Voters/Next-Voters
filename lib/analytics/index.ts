"use server"

import { db } from "../db"

const ensureChatCountRow = async () => {
    await db
        .insertInto("chat_count")
        .values({
            id: 1,
            responses: 0,
            requests: 0,
        })
        .onConflict((oc) => oc.column("id").doNothing())
        .execute();
}

export const handleIncrementResponse = async () => {
    await ensureChatCountRow()
    await db
        .updateTable("chat_count")
        .set(eb => ({
            responses: eb('responses', '+', 2)
        }))
        .where('id', '=', 1) 
        .execute()
}

export const handleIncrementRequest = async () => {
    await ensureChatCountRow()
    await db 
        .updateTable("chat_count")
        .set(eb => ({
            requests: eb("requests", "+", 1)
        }))
        .where('id', '=', 1)
        .execute()
}

export const handleGetResponseCount = async () => {
    await ensureChatCountRow()
    const row = await db
        .selectFrom("chat_count")
        .select('responses')
        .where('id', '=', 1)
        .executeTakeFirst() 

    return row?.responses ?? 0
}

export const handleGetRequestCount = async () => {
    await ensureChatCountRow()
    const row = await db
        .selectFrom("chat_count")
        .select("requests")
        .where("id", "=", 1)
        .executeTakeFirst() 

    return row?.requests ?? 0
}
