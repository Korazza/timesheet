import { SectionCards } from "@/components/section-cards"
import { ChartArea } from "@/components/chart-area"

export default async function DashboardPage() {
	return (
		<div className="@container/main flex-1 flex flex-col h-full p-4 gap-4">
			<SectionCards />
			<div className="md:flex-1">
				<ChartArea />
			</div>
		</div>
	)
}
