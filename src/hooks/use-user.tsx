import { createContext, useState, type ReactNode, useContext, useEffect } from "react";
import { api } from "../service/api";

export type USerData = {
	id: string;
	token: string;
	name: string;
	avatarURL: string;
};

type UserContextProps = {
	getUserInfo: (githubCode: string) => Promise<void>;
	userData: USerData;
	logout: () => void;
};

type UserProviderProps = {
	children: ReactNode;
};
export const userLocalStorageKey = `${import.meta.env.VITE_LOCALSTRAGE_KEY}: userData`;

const UserContext = createContext<UserContextProps>({} as UserContextProps);

export function UserProvider({ children }: UserProviderProps) {
	const [userData, setUserData] = useState<USerData>({} as USerData);

	function putUserData(data: USerData) {
		setUserData(data);

		localStorage.setItem(userLocalStorageKey, JSON.stringify(data));
	}

	async function getUserInfo(githubCode: string) {
		const { data } = await api.get<USerData>("/auth/callback", {
			params: {
				code: githubCode,
			},
		});

		putUserData(data);
	}

	async function loadUserData() {
		const localData = localStorage.getItem(userLocalStorageKey);

		if (localData) {
			setUserData(JSON.parse(localData) as USerData);
		}
	}

	async function logout() {
		setUserData({} as USerData);

		localStorage.removeItem(userLocalStorageKey);
	}

	useEffect(() => {
		loadUserData();
	}, []);

	return (
		<UserContext.Provider value={{ userData, getUserInfo, logout }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const context = useContext(UserContext);

	if (!context) {
		throw new Error("useUser must be used within an UserContext");
	}

	return context;
}
