"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { SupabaseClient } from "@supabase/supabase-js"

import { createClient } from "@/utils/supabase/server"

let supabase: SupabaseClient | undefined

export async function login() {
	supabase = await createClient()

	const { data } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo:
				process.env.NODE_ENV === "development"
					? "http://localhost:3000/auth/callback"
					: "https://assertcode-timesheet.netlify.app/auth/callback",
		},
	})

	if (data.url) {
		redirect(data.url)
	}

	revalidatePath("/", "layout")
	redirect("/")
}

export async function logout() {
	supabase = await createClient()
	await supabase.auth.signOut()
}
