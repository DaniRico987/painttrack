import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import users from "../data/files/users.json";

interface User {
  id: number;
  nameUser: string;
  password: string;
  role: string;
}

interface AuthContextProps {
  role: string | null;
  user: User | null;
  login: (username: string, password: string) => boolean;
  setRole: (role: string) => void;
  updateRole: (role: string) => void;
  clearRole: () => void;
  isLoaded: boolean;
}

const ROLE_KEY = "rol";
const USER_KEY = "user";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem(ROLE_KEY);
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedRole) setRoleState(savedRole);
    if (savedUser) setLoggedInUser(JSON.parse(savedUser));
    setIsLoaded(true);
  }, []);

  const login = (username: string, password: string): boolean => {
    const user = (users as User[]).find(
      (u) => u.nameUser === username && u.password === password
    );
    if (user) {
      localStorage.setItem(ROLE_KEY, user.role);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      setRoleState(user.role);
      setLoggedInUser(user);
      return true;
    }
    return false;
  };

  const setRole = (newRole: string) => {
    localStorage.setItem(ROLE_KEY, newRole);
    setRoleState(newRole);
    if (loggedInUser) {
      const updatedUser = { ...loggedInUser, role: newRole };
      setLoggedInUser(updatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    }
  };

  const updateRole = (newRole: string) => setRole(newRole);

  const clearRole = () => {
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER_KEY);
    setRoleState(null);
    setLoggedInUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ role, user: loggedInUser, login, setRole, updateRole, clearRole, isLoaded }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
