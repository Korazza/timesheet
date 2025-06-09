import { Suspense } from "react"
import { Plus } from "lucide-react"

import { Entry } from "@/db/schema"
import { EntriesTable } from "@/components/tables/entries-table"
import { Button } from "@/components/ui/button"

const today = new Date()
const yesterday = new Date()
yesterday.setDate(today.getDate() - 1)

async function getData(): Promise<Entry[]> {
	return new Promise((resolve) => {
		setTimeout(
			() =>
				resolve([
					{
						id: "728ed52f",
						type: "WORK",
						clientId: "1",
						employeeId: "1",
						description: null,
						date: new Date(),
						hours: 8.5,
						createdAt: yesterday,
					},
					{
						id: "728ed52f",
						type: "WORK",
						clientId: "2",
						employeeId: "1",
						description: null,
						date: yesterday,
						hours: 8,
						createdAt: new Date(),
					},
					{
						id: "728ed52f",
						type: "WORK",
						clientId: "3",
						employeeId: "1",
						description: null,
						date: new Date(),
						hours: 8,
						createdAt: new Date(),
					},
					{
						id: "728ed52f",
						type: "WORK",
						clientId: "4",
						employeeId: "1",
						description: null,
						date: new Date(),
						hours: 8,
						createdAt: new Date(),
					},
				]),
			0
		)
	})
}

export default async function EntriesPage() {
	const data = await getData()

	return (
		<div className="p-6 w-full">
			<div className="flex gap-4">
				<div className="text-xl font-semibold">Consuntivazioni lavorative</div>
				<Button>
					<Plus className="h-2 w-2" />
					Aggiungi
				</Button>
			</div>
			<Suspense fallback={"Loading..."}>
				<EntriesTable entries={data} />
			</Suspense>
		</div>
	)
}
