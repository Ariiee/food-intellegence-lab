import { createAuthClient } from "better-auth/react";

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_BACKEND_API_URL;
  if (envUrl) {
    const cleanUrl = envUrl.replace(/\/$/, "");
    return `${cleanUrl}/api/auth`;
  }
  return `${window.location.origin}/api/auth`;
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});


export const { useSession, signIn, signUp, signOut } = authClient;
