import { useAppContext } from '../context/AppContext';
import { UserPayload } from "../types";

/**
 * Hook that provides the current authentication state from the application context.
 *
 * @returns An object containing:
 *   - `currentUser` - The decoded user payload, or null if not authenticated.
 *   - `isAuthenticated` - Boolean indicating whether a user is currently logged in.
 *
 * @example
 * ```tsx
 * const { currentUser, isAuthenticated } = useAuth();
 * if (isAuthenticated) {
 *   console.log(`Logged in as ${currentUser.username}`);
 * }
 * ```
 */
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