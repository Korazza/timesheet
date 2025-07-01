"use client"

import { redirect } from "next/navigation"

export default function LoginRedirect() {
	return redirect(`/login?redirectUrl=${window.location.href}`)
}
