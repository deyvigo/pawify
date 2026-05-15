import { useState } from "react";
import { loginUser } from "../services/authService";
import { setAuthToken } from "../config";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await loginUser(username, password);
      setAuthToken(data.token);
      return data;
    } catch (err) {
      console.log(err);
      setError(err.message || "Credenciales inválidas");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
