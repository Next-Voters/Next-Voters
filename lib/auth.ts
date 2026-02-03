"use server"

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const isUserAuthenticatedAndHasAdminRole = async () => {
    // Check if Kinde is configured
    const kindeSiteUrl = process.env.KINDE_SITE_URL;
    const kindeIssuerUrl = process.env.KINDE_ISSUER_URL;
    
    // If Kinde is not configured, return false (not authenticated)
    if (!kindeSiteUrl || !kindeIssuerUrl) {
        return false;
    }
    
    try {
        const {isAuthenticated, getRoles} = getKindeServerSession();
        const isUserAuthenticated = isAuthenticated();
        const roles = await getRoles();
        const isAdmin = roles?.some((role) => role.key === "admin") || false

        return (
            isUserAuthenticated &&
            isAdmin
        );
    } catch (error) {
        // If there's an error with Kinde, assume not authenticated
        return false;
    }
}