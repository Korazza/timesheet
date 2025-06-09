import { eq } from "drizzle-orm";
import { cache } from 'react'

import db from "@/db";
import { entriesTable, type Entry } from "@/db/schema";

export const getEntries = cache((employeeId: Entry["employeeId"]) =>
  db.select().from(entriesTable).where(eq(entriesTable.employeeId, employeeId)));
