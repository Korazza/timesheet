"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import { z } from "zod"
import { CalendarIcon, Save } from "lucide-react"

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
import { EntryWithClient } from "@/db/schema"
import { updateEntry } from "@/actions/entries"
import { useEntries } from "@/hooks/use-entries"
import { useDialog } from "@/hooks/use-dialog"
import { cn } from "@/lib/utils"

const MIN_HOURS = 0.5
const MAX_HOURS = 24

interface SickEntryEditFormProps {
	entry: EntryWithClient
}

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

export function SickEntryEditForm({ entry }: SickEntryEditFormProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: new Date(entry.date),
			hours: entry.hours,
		},
	})
	const { setEntries } = useEntries()
	const { closeDialog } = useDialog()

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const updatedEntry: EntryWithClient = {
				...entry,
				...values,
				date: values.date.toISOString(),
			}

			await updateEntry(updatedEntry)

			setEntries((prevEntries) =>
				prevEntries.map((e) => (e.id === updatedEntry.id ? updatedEntry : e))
			)

			closeDialog()
			toast.success("Malattia aggiornata con successo")
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
					<Save />
					Salva
				</Button>
			</form>
		</Form>
	)
}
