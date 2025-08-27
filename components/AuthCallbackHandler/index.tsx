"use client";
import { useEffect } from "react";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

export default function AuthCallbackHandler() {
  const { handleGoogleCallback } = useGoogleAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("token") && urlParams.get("customer")) {
      handleGoogleCallback();
    }
  }, []);

  return null;
}
