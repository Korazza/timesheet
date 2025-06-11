"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import { z } from "zod"
import { CalendarIcon, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { entriesTable } from "@/db/schema"
import { addEntry } from "@/actions/entries"
import { useUser } from "@/hooks/use-user"
import { useEntries } from "@/hooks/use-entries"
import { useDialog } from "@/hooks/use-dialog"
import { cn } from "@/lib/utils"

const MIN_HOURS = 0.5
const MAX_HOURS = 24

const formSchema = z.object({
	date: z.date({
		required_error: "Inserire una data",
		message: "Valore errato",
	}),
	hours: z
		.number()
		.min(MIN_HOURS, `Le ore devono essere maggiori di ${MIN_HOURS}`)
		.max(MAX_HOURS, `Le ore devono essere minori di ${MAX_HOURS}`),
})

export function SickEntryCreateForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: new Date(),
			hours: 8,
		},
	})
	const { user } = useUser()
	const { setEntries } = useEntries()
	const { closeDialog } = useDialog()

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const entry: typeof entriesTable.$inferInsert = {
				...values,
				employeeId: user.id,
				type: "SICK",
				date: values.date.toISOString(),
			}

			const [createdEntry] = await addEntry(entry)

			setEntries((prevEntries) =>
				[...prevEntries, createdEntry].sort(
					(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
				)
			)

			closeDialog()
			toast.success("Malattia aggiunta con successo")
		} catch (e) {
			toast.error(String(e))
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="date"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Data</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={"outline"}
											className={cn(
												"w-[240px] pl-3 text-left font-normal",
												!field.value && "text-muted-foreground"
											)}
										>
											{field.value ? (
												format(field.value, "P", { locale: it })
											) : (
												<span>Seleziona una data</span>
											)}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={field.onChange}
										captionLayout="dropdown"
									/>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="hours"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ore</FormLabel>
							<FormControl>
								<span className="flex items-center gap-2">
									<Input
										{...field}
										className="w-fit"
										type="number"
										onChange={(e) => field.onChange(Number(e.target.value))}
									/>
									h
								</span>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit">
					<Plus />
					Aggiungi
				</Button>
			</form>
		</Form>
	)
}
