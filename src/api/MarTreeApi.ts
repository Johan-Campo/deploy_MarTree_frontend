import { isAxiosError } from "axios"
import api from "../config/axios"
import type { User, UserHandle, AnalyticsResponse } from "../types"

function handleApiError(error: unknown): never {
    if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error)
    }
    throw new Error("Error de conexión. Verifica tu internet.")
}

export async function getUser() {
    try {
        const { data } = await api<User>("/user")
        return data
    } catch (error) {
        handleApiError(error)
    }
}

export async function updateProfile(formData: User) {
    try {
        const { data } = await api.patch<User>("/user", formData)
        return data
    } catch (error) {
        handleApiError(error)
    }
}

export async function uploadProfileImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    try {
        const { data } = await api.post("/user/image", formData)
        return data
    } catch (error) {
        handleApiError(error)
    }
}

export async function getUserByHandle(handle: string) {
    try {
        const { data } = await api.get<UserHandle>(`/${handle}`)
        return data
    } catch (error) {
        handleApiError(error)
    }
}

export async function searchByHandle(handle: string) {
    try {
        const { data } = await api.post<string>('/search', { handle })
        return data
    } catch (error) {
        handleApiError(error)
    }
}

export async function recordVisit(handle: string) {
    try {
        await api.post(`/analytics/visit/${handle}`)
    } catch {
        // silent — analytics errors shouldn't affect UX
    }
}

export async function recordClick(handle: string, linkName: string) {
    try {
        await api.post("/analytics/click", { handle, linkName })
    } catch {
        // silent
    }
}

export async function getAnalytics() {
    try {
        const { data } = await api.get<AnalyticsResponse>("/analytics")
        return data
    } catch (error) {
        handleApiError(error)
    }
}
