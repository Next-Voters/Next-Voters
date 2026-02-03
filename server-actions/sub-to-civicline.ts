"use server"

import { db } from "@/lib/db"
import { PreferredCommunication } from "@/types/preferences"

export const handleSubscribe = async (contact: string, topics: string[], type_contact: PreferredCommunication) => {

    const isEmailSubbed = await db
        .selectFrom("subscriptions")
        .select("contact")
        .where("contact", "=", contact)
        .executeTakeFirst()

    if (!isEmailSubbed) {
        await db
            .insertInto("subscriptions")
            .values({ contact, topics, type_contact })
            .execute()
    } else {
        return { error: "Contact already subscribed" }
    }
}