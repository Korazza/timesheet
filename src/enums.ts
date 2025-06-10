import { ActivityType, EntryType, Role } from "@/db/schema";

export const roleOptions: { label: string; value: Role }[] = [
  { label: "Dipendente", value: "EMPLOYEE" },
  { label: "Amministratore", value: "ADMIN" },
];

export const entryTypeOptions: { label: string; value: EntryType }[] = [
  { label: "Lavoro", value: "WORK" },
  { label: "Ferie", value: "HOLIDAY" },
  { label: "Permesso", value: "PERMIT" },
  { label: "Malattia", value: "SICK" },
];

export const activityTypeOptions: { label: string; value: ActivityType }[] = [
  { label: "Progetto", value: "PROJECT" },
  { label: "Task", value: "TASK" },
  { label: "AMS", value: "AMS" },
];
