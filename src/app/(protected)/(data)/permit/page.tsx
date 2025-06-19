import { PermitEntriesTable } from "@/components/tables/permit-entries-table"

export default async function PermitPage() {
	return (
		<div className="flex h-full flex-col gap-4 py-4 md:p-4">
			<PermitEntriesTable />
		</div>
	)
}
