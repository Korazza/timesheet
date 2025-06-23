import { getTranslations } from "next-intl/server"
import { FileSpreadsheet, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { getEmployeeById } from "@/actions/employees"
import { getEntries } from "@/actions/entries"

export default async function EmployeeDetailPage({
	params,
}: {
	params: Promise<{ employeeId: string }>
}) {
	const { employeeId } = await params

	const [employee, entries, t] = await Promise.all([
		getEmployeeById(employeeId),
		getEntries(employeeId),
		getTranslations("EmployeeDetail"),
	])

	return (
		<div className="container mx-auto py-8">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="flex items-center gap-2 text-3xl font-bold">
					<User className="h-7 w-7" /> {t("title")}
				</h1>
				<Button variant="outline">
					<FileSpreadsheet className="mr-2 h-5 w-5" /> {t("export")}
				</Button>
			</div>
			{employee && (
				<div className="mb-8 rounded border p-4">
					<div className="mb-2 font-semibold">
						{employee.firstName} {employee.lastName}
					</div>
					<div className="text-muted-foreground text-sm">{employee.email}</div>
					<div className="text-muted-foreground text-sm">
						{t("role")}: {employee.role}
					</div>
				</div>
			)}
			<h2 className="mb-2 text-xl font-semibold">{t("entriesTitle")}</h2>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>{t("date")}</TableHead>
						<TableHead>{t("client")}</TableHead>
						<TableHead>{t("type")}</TableHead>
						<TableHead>{t("hours")}</TableHead>
						<TableHead>{t("overtime")}</TableHead>
						<TableHead>{t("description")}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{entries.length === 0 ? (
						<TableRow>
							<TableCell colSpan={6}>{t("noEntries")}</TableCell>
						</TableRow>
					) : (
						entries.map((entry) => (
							<TableRow key={entry.id}>
								<TableCell>
									{entry.date ? new Date(entry.date).toLocaleDateString() : ""}
								</TableCell>
								<TableCell>{entry.client?.name ?? "-"}</TableCell>
								<TableCell>{entry.type}</TableCell>
								<TableCell>{entry.hours}</TableCell>
								<TableCell>{entry.overtimeHours ?? "-"}</TableCell>
								<TableCell>{entry.description}</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	)
}
