import { Network, ExternalLink, CircleUser, QrCode, TrendingUp } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const tabs = [
    { name: 'Redes',      href: '/admin',              icon: Network },
    { name: 'Mis Links',  href: '/admin/custom-links', icon: ExternalLink },
    { name: 'Mi Perfil',  href: '/admin/profile',      icon: CircleUser },
    { name: 'QR Code',    href: '/admin/qr',           icon: QrCode },
    { name: 'Analíticas', href: '/admin/analytics',    icon: TrendingUp },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function NavigationTabs() {
    const location = useLocation()
    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        navigate(e.target.value)
    }

    return (
        <div className="mb-8">
            {/* Mobile select */}
            <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">Seleccionar sección</label>
                <select
                    id="tabs"
                    name="tabs"
                    className="block w-full rounded-xl border border-slate-200 dark:border-white/20 bg-white dark:bg-white/10 text-slate-800 dark:text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onChange={handleChange}
                    defaultValue={location.pathname}
                >
                    {tabs.map((tab) => (
                        <option value={tab.href} key={tab.name} className="bg-gray-900">{tab.name}</option>
                    ))}
                </select>
            </div>

            {/* Desktop pill tabs */}
            <div className="hidden sm:block">
                <nav className="inline-flex gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-sm" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.name}
                            to={tab.href}
                            className={classNames(
                                location.pathname === tab.href
                                    ? 'bg-gradient-to-r from-purple-600 to-teal-500 text-white shadow-md shadow-purple-600/20'
                                    : 'text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white/80 hover:bg-slate-200 dark:hover:bg-white/5',
                                'flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200'
                            )}
                        >
                            <tab.icon className="w-4 h-4" aria-hidden="true" />
                            {tab.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    )
}
