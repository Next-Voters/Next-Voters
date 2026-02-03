"use server"

import { db } from "@/lib/db"

export const handleSubscribe = async (contact: string, topics: string[]) => {

    const isEmailSubbed = await db
        .selectFrom("subscriptions")
        .select("contact")
        .where("contact", "=", contact)
        .executeTakeFirst()

    if (!isEmailSubbed) {
        await db
            .insertInto("subscriptions")
            .values({ contact, topics })
            .execute()
    } else {
        return { error: "Contact already subscribed" }
    }
}