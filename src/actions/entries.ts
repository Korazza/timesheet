"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { desc, eq } from "drizzle-orm";

import db from "@/db";
import { entriesTable, type Entry } from "@/db/schema";

export const getEntries = async (employeeId: Entry["employeeId"]) =>
  unstable_cache(
    async () =>
      db.query.entriesTable.findMany({
        where: eq(entriesTable.employeeId, employeeId),
        orderBy: desc(entriesTable.date),
        with: { client: true },
      }),
    [`entries-${employeeId}`],
    {
      tags: [`entries-${employeeId}`],
    },
  )();

export const addEntry = async (entry: typeof entriesTable.$inferInsert) => {
  const createdEntry = await db.insert(entriesTable).values(entry).returning();
  if (entry.employeeId) {
    revalidateTag(`entries-${entry.employeeId}`);
  }
  return createdEntry;
};

export const updateEntry = async (entry: Entry) => {
  await db
    .update(entriesTable)
    .set(entry)
    .where(eq(entriesTable.id, entry.id));
  revalidateTag(`entries-${entry.employeeId}`);
};

export const deleteEntry = async (entryId: Entry["id"]) => {
  const entry = await db.query.entriesTable.findFirst({
    where: eq(entriesTable.id, entryId),
    columns: {
      employeeId: true,
    },
  });

  if (entry) {
    await db.delete(entriesTable).where(eq(entriesTable.id, entryId));
    revalidateTag(`entries-${entry.employeeId}`);
  }
};
