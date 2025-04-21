import { ref } from "vue";
import { msalEntity, state, graphScopes } from "./msalConfig.js";

export function useAuth() {
    const isAuthenticated = ref(false);
    const login = async () => {
        try {
            if (!msalEntity) {
                throw new Error("MSAL not initialized");
            }
            await msalEntity.loginRedirect();
            isAuthenticated.value = true;
            const loginResponse = await msalEntity.loginRedirect();
            isAuthenticated.value = true;
            console.log("Login success: ", loginResponse);
        } catch (error) {
            console.log("Login error: ", error);
        }
    };

    const logout = () => {
        if (!msalEntity) {
            throw new Error("MSAL not initialized");
        }
        msalEntity.logoutRedirect();
        isAuthenticated.value = false;
        console.log("Logged out");
    };
    const handleRedirect = async () => {
        try {
            await msalEntity.handleRedirectPromise();
            state.isAuthenticated = msalEntity.getAllAccounts().length > 0;
            state.user = msalEntity.getAllAccounts()[0];
            if (state.user != null) {
                msalEntity.setActiveAccount(state.user);
            }

            console.log(state.isAuthenticated, state.user);
            return state.isAuthenticated;
        } catch (error) {
            console.log("Redirect Error:", error);
        }
    };
    const getAccessToken = async () => {
        try {
            await msalEntity.initialize();

            const accounts = msalEntity.getAllAccounts();
            if (accounts.length >= 1) {
                const account = { account: accounts[0] };
                const request = Object.assign(graphScopes, account);
                const tokenResponse = await msalEntity.acquireTokenSilent(request);
                return tokenResponse.accessToken;
            }
            return null;
        } catch (error) {
            console.log(error);
            console.log("logout");
            // logout();
        }
    };

    return { isAuthenticated, login, logout, handleRedirect, getAccessToken };
}
