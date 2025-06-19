import { SectionCards } from "@/components/section-cards"
import { ChartArea } from "@/components/chart-area"

export default async function DashboardPage() {
	return (
		<div className="@container/main flex h-full flex-1 flex-col gap-4 p-4">
			<SectionCards />
			<div className="md:flex-1">
				<ChartArea />
			</div>
		</div>
	)
}
