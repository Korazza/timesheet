"use client"

import { redirect } from "next/navigation"
import { LogOut } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { logout } from "@/actions/auth"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

export default function Forbidden() {
	const t = useTranslations("Forbidden")

	return (
		<div className="flex min-h-[100dvh] flex-col items-center justify-center text-center">
			<Card className="px-4">
				<CardTitle className="flex h-5 items-center space-x-4 text-sm">
					<span className="text-primary scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
						{t("title")}
					</span>
				</CardTitle>
				<CardContent>
					<Button
						size="lg"
						variant="outline"
						onClick={async () => {
							await logout()
							redirect("/login")
						}}
					>
						<LogOut />
						{t("logout")}
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}
