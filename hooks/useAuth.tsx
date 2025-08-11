"use client"
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { login, logout, clearAuthState } from '@/store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const loginUser = (userData: User, remember: boolean = false) => {
    dispatch(login({ user: userData, remember }));
  };
  
  const logoutUser = () => {
    dispatch(logout());
  };
  
  const clearAuth = () => {
    dispatch(clearAuthState());
  };
  
  return {
    user,
    isAuthenticated,
    loginUser,
    logoutUser,
    clearAuth
  };
};