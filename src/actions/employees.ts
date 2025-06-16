import { cache } from "react";
import { eq } from "drizzle-orm";

import db from "@/db";
import { employeesTable } from "@/db/schema";
import { getUser } from "@/utils/supabase/user";

const getCachedEmployee = cache(
  async (userId: string) => {
    return db.query.employeesTable.findFirst({
      where: eq(employeesTable.userId, userId),
    });
  },
);

export const getEmployee = async () => {
  const user = await getUser();

  if (!user) {
    return null;
  }

  return getCachedEmployee(user.id);
};
