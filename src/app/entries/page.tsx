import { Entry } from "@/db/schema"
import { columns } from "./columns"
import { DataTable } from "./data-table"

const today = new Date()
const tomorrow = new Date(new Date().setDate(today.getDate() + 1))

async function getData(): Promise<Entry[]> {
	// Fetch data from your API here.
	return [
		{
			id: "728ed52f",
			type: "WORK",
			clientId: "ALMAVIVA",
			employeeId: "123",
			description: null,
			date: new Date(),
			hours: 8,
			createdAt: tomorrow,
		},
		{
			id: "728ed52f",
			type: "WORK",
			clientId: "DELOITTE",
			employeeId: "123",
			description: null,
			date: new Date(),
			hours: 8,
			createdAt: new Date(),
		},
		{
			id: "728ed52f",
			type: "WORK",
			clientId: "ENEL",
			employeeId: "123",
			description: null,
			date: new Date(),
			hours: 8,
			createdAt: new Date(),
		},
		{
			id: "728ed52f",
			type: "WORK",
			clientId: "FINCONS",
			employeeId: "123",
			description: null,
			date: new Date(),
			hours: 8,
			createdAt: new Date(),
		},
	]
}

export default async function EntriesPage() {
	const data = await getData()

	return (
		<div className="p-6 w-full">
			<DataTable columns={columns} data={data} />
		</div>
	)
}
