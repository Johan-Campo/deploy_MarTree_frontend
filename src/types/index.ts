export type CustomLink = {
    id: string
    title: string
    url: string
    emoji: string
    enabled: boolean
}

export type User = {
    handle: string;
    name: string;
    email: string;
    _id: string;
    description: string;
    image: string;
    links: string;
    customLinks: string;
    theme: string;
}
export type UserHandle = Pick<User, 'description' | 'handle' | 'image' | 'links' | 'name' | 'customLinks' | 'theme'>
export type RegisterForm = Pick<User, "handle" | "name" | "email"> & {
    password: string;
    password_confirmation: string;
}

export type LoginForm = Pick<User, "email"> & {
    password: string;
}

export type profileForm = Pick<User, "handle" | "name" | "description"> 

export type SocialNetwork = {
    id: string;
    name: string;
    url: string;
    enabled: boolean;
}

export type MarTreeLinks = Pick<SocialNetwork, "name" | "url" | "enabled">;

export type DailyViewEntry = {
    date: string
    views: number
}

export type AnalyticsResponse = {
    totalViews: number
    weekViews: number
    totalClicks: number
    clickTotals: Record<string, number>
    customLinkMeta: Record<string, { title: string; emoji: string }>
    daily: DailyViewEntry[]
}

