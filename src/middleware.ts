import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

// TODO: The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
const { auth: middleware } = NextAuth(authConfig)
export default middleware
