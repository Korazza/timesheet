"use server"

import { User } from "@supabase/supabase-js"
import { createClient } from "./server"

export const getUser = async () => {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()
	return user
}

export const getUserAvatar = async (user: User): Promise<string> => {
	return user?.user_metadata.picture || ""
}
