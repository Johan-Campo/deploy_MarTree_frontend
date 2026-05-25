import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'

export default function AdminNavigation() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem('AUTH_TOKEN')
        queryClient.clear()
        navigate('/auth/login')
    }

    return (
        <button
            type="button"
            onClick={logout}
            aria-label="Cerrar sesión"
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-white/90 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
        </button>
    );
}
