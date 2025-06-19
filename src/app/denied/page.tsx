"use client"

import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { logout } from "@/actions/auth"
import { redirect } from "next/navigation"

export default function AccessDeniedPage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
			<h1 className="text-primary mb-6 scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
				Accesso Negato
			</h1>
			<Button
				variant="outline"
				onClick={async () => {
					await logout()
					redirect("/login")
				}}
			>
				<LogOut />
				Log out
			</Button>
		</div>
	)
}
