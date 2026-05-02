import { useAppContext } from "../../App";
import { UserPayload } from "../types";

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