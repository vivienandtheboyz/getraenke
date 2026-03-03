import { createAuthClient } from "better-auth/vue";
import { genericOAuthClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "/api/auth",
  plugins: [genericOAuthClient()],
});

export const useAuth = () => {
  const session = authClient.useSession();

  const signInWithOidc = (callbackURL?: string) =>
    authClient.signIn.oauth2({
      providerId: "oidc",
      callbackURL: callbackURL ?? "/",
    });

  const signOut = () => authClient.signOut();

  return {
    session,
    signInWithOidc,
    signOut,
  };
};
