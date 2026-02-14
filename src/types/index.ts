export type User = {
    handle: string;
    name: string;
    email: string;
    _id: string;
    description: string;
    image: string;
    links: string;
}
export type UserHandle = Pick<User, 'description' | 'handle' | 'image' | 'links' | 'name' >
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

