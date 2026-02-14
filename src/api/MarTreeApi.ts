import { isAxiosError } from "axios"
import api from "../config/axios"
import type { User, UserHandle } from "../types"


export async function getUser() {
    try {
        const { data } = await api<User>("/user")
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function updateProfile(formData: User) {
    try {
        const response = await api.patch<User>("/user", formData)
        return response.data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function uploadProfileImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    try {
        const {data} = await api.post("/user/image", formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getUserByHandle(handle: string) {
    try {
        const response = await api.get<UserHandle>(`/${handle}`)
        return response.data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function searchByHandle(handle: string) {
    try {
        const { data } = await api.post<string>('/search', {handle})
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}