import { eq } from "drizzle-orm";

import db from "@/db";
import { entriesTable, type Entry } from "@/db/schema";

export const getEntries = (employeeId: Entry["employeeId"]) =>
  db.select().from(entriesTable).where(eq(entriesTable.employeeId, employeeId));
