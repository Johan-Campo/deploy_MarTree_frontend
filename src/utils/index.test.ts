import { describe, it, expect } from 'vitest'
import { isValidUrl } from './index'

describe('isValidUrl', () => {
    it('devuelve true para una URL completa con https', () => {
        expect(isValidUrl('https://www.example.com')).toBe(true)
    })

    it('devuelve true para una URL con http', () => {
        expect(isValidUrl('http://example.com')).toBe(true)
    })

    it('devuelve true para una URL con path y query params', () => {
        expect(isValidUrl('https://github.com/Johan-Campo?tab=repositories')).toBe(true)
    })

    it('devuelve false para texto sin protocolo', () => {
        expect(isValidUrl('example.com')).toBe(false)
    })

    it('devuelve false para texto vacío', () => {
        expect(isValidUrl('')).toBe(false)
    })

    it('devuelve false para texto aleatorio', () => {
        expect(isValidUrl('no soy una url')).toBe(false)
    })

    it('devuelve false para solo el protocolo', () => {
        expect(isValidUrl('https://')).toBe(false)
    })
})
