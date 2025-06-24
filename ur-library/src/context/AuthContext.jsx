import { createContext, useContext } from 'react';

// 1. Membuat dan mengekspor Context
export const AuthContext = createContext();

// 2. Membuat dan mengekspor Hook untuk kemudahan penggunaan
export const useAuth = () => {
  return useContext(AuthContext);
};