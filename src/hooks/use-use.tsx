import { createContext, useState, type ReactNode, useContext } from "react";
import { api } from "../service/api";


export type USerData = {
    id: string;
    token: string;
    name: string;
    avatar_url: string;
} 

type UserContextProps = {
    getUserInfo: (githubCode: string) => void;
    userData: USerData;
}

type UserProviderProps = {
    children: ReactNode;
}

const UserContext = createContext<UserContextProps>({} as UserContextProps);

export function UserProvider({ children }: UserProviderProps) {
    const [userData, setUserData] = useState<USerData>({} as USerData);

    async function getUserInfo(githubCode: string) {
        const { data }  = await api.get<USerData>("/auth/callback", {
            params: {
                code: githubCode,
            },

        })

      setUserData(data)
    }

    return (
        <UserContext.Provider value={{ userData, getUserInfo }}>
            {children}
        </UserContext.Provider>
    )

}

export function useUser() {
    const context = useContext(UserContext)

    if (!context) {
        throw new Error("useUser must be used within an UserContext") 
    }

    return context;
}