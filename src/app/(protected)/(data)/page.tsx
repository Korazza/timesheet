import { SectionCards } from "@/components/section-cards"
import { ChartArea } from "@/components/chart-area"

export default async function DashboardPage() {
	return (
		<div className="@container/main flex flex-col h-full py-4 px-4 lg:px-6 md:py-6 gap-4">
			<SectionCards />
			<div className="md:flex-1">
				<ChartArea />
			</div>
		</div>
	)
}
