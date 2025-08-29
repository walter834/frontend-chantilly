"use client";

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export const useAuthAdmin = () => {
  const { isAuthenticated, token, user } = useSelector(
    (state: RootState) => state.authAdmin
  );

  return {
    isAuthenticated,
    token,
    user,

    id: user?.id,
    username: user?.username,
    email: user?.email,
  };
};
