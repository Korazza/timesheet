"use server";

import { createClient } from "./server";

export const getUser = async () => {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	return user;
};

export const getUserAvatar = async (): Promise<string> => {
	const user = await getUser();
	return user?.user_metadata.picture || "";
};
