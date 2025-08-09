import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user/token in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Fake authentication - in a real app, this would be an API call
    setLoading(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email === "admin@example.com" && password === "admin123") {
          const userData = {
            id: "1",
            name: "Admin User",
            email,
            role: "admin" as const,
          };
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          resolve();
        } else if (email === "editor@example.com" && password === "editor123") {
          const userData = {
            id: "2",
            name: "Editor User",
            email,
            role: "editor" as const,
          };
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          resolve();
        } else {
          reject(new Error("Invalid credentials"));
        }
        setLoading(false);
      }, 800); // Simulate network delay
    });
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
