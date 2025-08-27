import { getUser } from "@/Services/AuthService";
import React, { useEffect, useState } from "react";

interface AppContextType {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

interface UserType {
  [key: string]: string | number | Date;
}

export const AppContext = React.createContext<AppContextType | null>(null);

export function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  useEffect(() => {
    if (token) {
      getUser().then((data) => {
        if (data) {
          setUser(data);
        }
      });
    } else {
      setUser(null);
    }
  }, [token]);
  return (
    <AppContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AppContext.Provider>
  );
}
