import { SectionCards } from "@/components/section-cards"
import { ChartArea } from "@/components/chart-area"

export default async function DashboardPage() {
	return (
		<div className="flex flex-1 flex-col h-full">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 flex-1">
					<SectionCards />
					<div className="px-4 lg:px-6 flex-1">
						<ChartArea />
					</div>
				</div>
			</div>
		</div>
	)
}
