import { ref } from "vue";
import { myMSALObj, state, graphScopes } from "./msalConfig.js";

export function useAuth() {
    const isAuthenticated = ref(false);
    const login = async () => {
        try {
            if (!myMSALObj) {
                throw new Error("MSAL not initialized");
            }
            await myMSALObj.loginRedirect();
            isAuthenticated.value = true;
            const loginResponse = await myMSALObj.loginRedirect();
            isAuthenticated.value = true;
            console.log("Login success: ", loginResponse);
        } catch (error) {
            console.log("Login error: ", error);
        }
    };

    const logout = () => {
        if (!myMSALObj) {
            throw new Error("MSAL not initialized");
        }
        myMSALObj.logoutRedirect();
        isAuthenticated.value = false;
        console.log("Logged out");
    };
    const handleRedirect = async () => {
        try {
            await myMSALObj.handleRedirectPromise();
            state.isAuthenticated = myMSALObj.getAllAccounts().length > 0;
            state.user = myMSALObj.getAllAccounts()[0];
            if (state.user != null) {
                myMSALObj.setActiveAccount(state.user);
            }

            console.log(state.isAuthenticated, state.user);
            return state.isAuthenticated;
        } catch (error) {
            console.log("Redirect Error:", error);
        }
    };
    const getAccessToken = async () => {
        try {
            const accounts = myMSALObj.getAllAccounts();
            if (accounts.length >= 1) {
                const account = { account: accounts[0] };
                const request = Object.assign(graphScopes, account);
                const tokenResponse = await myMSALObj.acquireTokenSilent(request);
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
