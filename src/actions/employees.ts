import { unstable_cache } from "next/cache";
import { eq } from "drizzle-orm";

import db from "@/db";
import { EmployeeWithAvatar, employeesTable } from "@/db/schema";
import { getUser, getUserAvatar } from "@/utils/supabase/user";

const getCachedEmployee = (userId: string) =>
	unstable_cache(
		async () => {
			return db.query.employeesTable.findFirst({
				where: eq(employeesTable.userId, userId),
			});
		},
		[`employee-${userId}`],
		{
			tags: ["user"],
		},
	)();

export const getEmployee = async (): Promise<EmployeeWithAvatar | null> => {
	const user = await getUser();

	if (!user) {
		return null;
	}

	const [employee, avatarUrl] = await Promise.all([
		getCachedEmployee(user.id),
		getUserAvatar(),
	]);

	return employee
		? {
			...employee,
			avatarUrl: avatarUrl,
		}
		: null;
};
