import { TrendingDown, TrendingUp } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
	return (
		<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Media ore/giorno</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						8.1 h
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<TrendingUp />
							+1.0%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						In aumento dal mese scorso <TrendingUp className="size-4" />
					</div>
					<div className="text-muted-foreground">
						Basato su 405 giorni lavorativi
					</div>
				</CardFooter>
			</Card>
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Giornate registrate</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						16/20
					</CardTitle>
					<CardAction>
						<Badge variant="outline">-4</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						4 giornate da registrare
					</div>
					<div className="text-muted-foreground">
						Giornate registrate nel mese corrente
					</div>
				</CardFooter>
			</Card>
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Ore totali</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						123 h
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<TrendingUp />
							+5.2%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						In aumento dal mese scorso <TrendingUp className="size-4" />
					</div>
					<div className="text-muted-foreground">
						Totale ore nel mese corrente
					</div>
				</CardFooter>
			</Card>
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Straordinari</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						6 h
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<TrendingUp />
							+2.5%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						In aumento in questo mese <TrendingUp className="size-4" />
					</div>
					<div className="text-muted-foreground">
						Ore oltre il limite giornaliero
					</div>
				</CardFooter>
			</Card>
		</div>
	)
}
