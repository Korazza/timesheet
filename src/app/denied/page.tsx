"use client"

import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { logout } from "@/actions/auth"
import { redirect } from "next/navigation"

export default function AccessDeniedPage() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
			<h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance text-primary mb-6">
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
