import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getUser, updateProfile, getUserByHandle } from './MarTreeApi'
import api from '../config/axios'

// api es una instancia axios — se llama como función (api("/user"))
// y también tiene métodos (.patch, .get, .post)
vi.mock('../config/axios', () => {
    const mockFn = vi.fn()
    mockFn.patch = vi.fn()
    mockFn.get = vi.fn()
    mockFn.post = vi.fn()
    mockFn.interceptors = { request: { use: vi.fn() } }
    return { default: mockFn }
})

const mockApi = api as unknown as ReturnType<typeof vi.fn> & {
    patch: ReturnType<typeof vi.fn>
    get: ReturnType<typeof vi.fn>
    post: ReturnType<typeof vi.fn>
}

const makeAxiosError = (message: string) =>
    Object.assign(new Error(message), {
        isAxiosError: true,
        response: { data: { error: message } },
    })

const makeNetworkError = () =>
    Object.assign(new Error('Network Error'), {
        isAxiosError: true,
        response: undefined,
    })

describe('getUser', () => {
    beforeEach(() => vi.clearAllMocks())

    it('devuelve los datos del usuario en una petición exitosa', async () => {
        const mockUser = { handle: 'johancampo', name: 'Johan', email: 'test@test.com', _id: '1', description: '', image: '', links: '[]' }
        mockApi.mockResolvedValue({ data: mockUser })

        const result = await getUser()
        expect(result).toEqual(mockUser)
    })

    it('lanza el mensaje de error del servidor', async () => {
        mockApi.mockRejectedValue(makeAxiosError('No autorizado'))
        await expect(getUser()).rejects.toThrow('No autorizado')
    })

    it('lanza error de conexión cuando no hay respuesta', async () => {
        mockApi.mockRejectedValue(makeNetworkError())
        await expect(getUser()).rejects.toThrow('Error de conexión. Verifica tu internet.')
    })
})

describe('updateProfile', () => {
    beforeEach(() => vi.clearAllMocks())

    it('devuelve datos actualizados en una petición exitosa', async () => {
        const mockUser = { handle: 'nuevo', name: 'Johan', email: 'test@test.com', _id: '1', description: 'Bio', image: '', links: '[]' }
        mockApi.patch.mockResolvedValue({ data: mockUser })

        const result = await updateProfile(mockUser)
        expect(result).toEqual(mockUser)
    })

    it('lanza el mensaje de error del servidor', async () => {
        const mockUser = { handle: 'ocupado', name: 'Johan', email: 'test@test.com', _id: '1', description: '', image: '', links: '[]' }
        mockApi.patch.mockRejectedValue(makeAxiosError('Este handle ya está en uso'))

        await expect(updateProfile(mockUser)).rejects.toThrow('Este handle ya está en uso')
    })
})

describe('getUserByHandle', () => {
    beforeEach(() => vi.clearAllMocks())

    it('devuelve la información pública del usuario', async () => {
        const mockHandle = { handle: 'johancampo', name: 'Johan', description: 'Bio', image: '', links: '[]' }
        mockApi.get.mockResolvedValue({ data: mockHandle })

        const result = await getUserByHandle('johancampo')
        expect(result).toEqual(mockHandle)
        expect(mockApi.get).toHaveBeenCalledWith('/johancampo')
    })

    it('lanza error cuando el handle no existe', async () => {
        mockApi.get.mockRejectedValue(makeAxiosError('El usuario no existe'))
        await expect(getUserByHandle('noexiste')).rejects.toThrow('El usuario no existe')
    })
})
