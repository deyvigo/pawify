import { useAppContext } from '../context/AppContext';
import { UserPayload } from "../types";

// Estado de autenticacion del usuario (currentUser, isAuthenticated)
export function useAuth(): {
  currentUser: UserPayload | null;
  isAuthenticated: boolean;
} {
  const { currentUser } = useAppContext();

  return {
    currentUser,
    isAuthenticated: currentUser !== null,
  };
}