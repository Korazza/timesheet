import db from "@/db";
import { clientsTable } from "@/db/schema";

export const getClients = () => db.select().from(clientsTable);
