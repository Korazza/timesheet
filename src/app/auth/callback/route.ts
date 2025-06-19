import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";
import db from "@/db";
import { eq, or } from "drizzle-orm";
import { employeesTable } from "@/db/schema";
import { getUserAvatar } from "@/utils/supabase/user";

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	// if "next" is in param, use it as the redirect URL
	let next = searchParams.get("next") ?? "/";
	if (!next.startsWith("/")) {
		// if "next" is not a relative URL, use the default
		next = "/";
	}

	if (code) {
		const supabase = await createClient();
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			const email = user?.email;
			const userId = user?.id;
			const firstName = user?.user_metadata.full_name.split(" ")[0] || "";
			const lastName = user?.user_metadata.full_name.split(" ")[1] || "";

			if (!userId || !email || !email.endsWith("@assertcode.it")) {
				return NextResponse.redirect(`${origin}/denied`);
			}

			const existing = await db.query.employeesTable.findFirst({
				where: or(
					eq(employeesTable.userId, userId),
					eq(employeesTable.email, email),
				),
			});

			console.log(await getUserAvatar());

			if (!existing) {
				await db.insert(employeesTable).values({
					userId,
					firstName,
					lastName,
					email,
				});
			} else if (existing.email === email && existing.userId !== userId) {
				await db
					.update(employeesTable)
					.set({ userId })
					.where(eq(employeesTable.email, email));
			}

			const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
			const isLocalEnv = process.env.NODE_ENV === "development";
			if (isLocalEnv) {
				// we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
				return NextResponse.redirect(`${origin}${next}`);
			} else if (forwardedHost) {
				return NextResponse.redirect(`https://${forwardedHost}${next}`);
			} else {
				return NextResponse.redirect(`${origin}${next}`);
			}
		}
	}

	// return the user to an error page with instructions
	return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
