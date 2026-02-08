"use client"

export const setPreference = (region: string) => {
    if (typeof window !== 'undefined') {
    localStorage.setItem("preference-region", region);
    }
}

export const getPreference = () => {
    if (typeof window !== 'undefined') {
    return localStorage.getItem("preference-region");
    }
}

export const removePreference = () => {
    if (typeof window !== 'undefined') {
    localStorage.removeItem("preference-region");
    }
}  