"use server";

import { cache } from "react";
import { desc, eq } from "drizzle-orm";

import db from "@/db";
import { entriesTable, type Entry } from "@/db/schema";

export const getEntries = cache(
  async (employeeId: Entry["employeeId"]) =>
    db.query.entriesTable.findMany({
      where: eq(entriesTable.employeeId, employeeId),
      orderBy: desc(entriesTable.date),
      with: { client: true },
    }),
);

export const addEntry = async (entry: typeof entriesTable.$inferInsert) => {
  const createdEntry = await db.insert(entriesTable).values(entry).returning();
  return createdEntry;
};

export const updateEntry = async (entry: Entry) => {
  await db
    .update(entriesTable)
    .set(entry)
    .where(eq(entriesTable.id, entry.id));
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
  }
};
