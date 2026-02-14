import { useQueryClient } from '@tanstack/react-query'
export default function AdminNavigation() {
    const queryClient = useQueryClient()
    const logout = () => {
        localStorage.removeItem('AUTH_TOKEN')
        queryClient.invalidateQueries({queryKey: ['user']})
    }
    return (
        <div className="relative">
            <h3 className="p-0 m-0" onClick={logout}>Cerrar Sesión</h3>
        </div>
    );
}