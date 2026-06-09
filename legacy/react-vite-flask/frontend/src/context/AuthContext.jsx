import { createContext, useContext } from 'react';

// membuat context untuk autentikasi yang dapat digunakan di seluruh aplikasi
export const AuthContext = createContext();

// hook custom untuk mengakses context autentikasi dengan mudah
export const useAuth = () => {
  return useContext(AuthContext);
};
