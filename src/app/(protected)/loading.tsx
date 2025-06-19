import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
	return (
		<div className="w-full space-y-6 p-6">
			{/* Header */}
			<Skeleton className="h-10 w-1/3" />

			{/* Cards */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Skeleton className="h-24 w-full rounded-xl" />
				<Skeleton className="h-24 w-full rounded-xl" />
				<Skeleton className="h-24 w-full rounded-xl" />
				<Skeleton className="h-24 w-full rounded-xl" />
			</div>

			{/* Table Skeleton */}
			<div className="space-y-2">
				<Skeleton className="h-6 w-1/4" />
				<div className="overflow-hidden rounded-xl border">
					{/* Table header */}
					<div className="bg-muted grid grid-cols-4 gap-4 p-4">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
					</div>

					{/* Table rows */}
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className="grid grid-cols-4 gap-4 border-t p-4">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
