import { Auth0Client } from "@auth0/nextjs-auth0/server";

if (!process.env.AUTH0_SECRET) {
    console.error("Auth0: AUTH0_SECRET is not set in process.env");
} else {
    console.log("Auth0: AUTH0_SECRET is set.");
}

export const auth0 = new Auth0Client();
