"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { format } from "date-fns"

import { z } from "zod"

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
import { cn } from "@/lib/utils"
import { CalendarIcon, Save } from "lucide-react"

import { Input } from "@/components/ui/input"
import { EntryWithClient } from "@/db/schema"
import { updateEntry } from "@/actions/entries"
import { useEntries } from "@/hooks/use-entries"
import { useDialog } from "@/hooks/use-dialog"

const MIN_HOURS = 0.5
const MAX_HOURS = 24

interface PermitEntryEditFormProps {
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

export function PermitEntryEditForm({ entry }: PermitEntryEditFormProps) {
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
			toast.success("Permesso aggiornato con successo")
		} catch (e) {
			toast.error(String(e))
		}
	}

	const isLoading = form.formState.isSubmitting

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
								<PopoverTrigger asChild disabled={isLoading}>
									<FormControl>
										<Button
											variant={"outline"}
											className={cn(
												"w-[240px] pl-3 text-left font-normal",
												!field.value && "text-muted-foreground"
											)}
										>
											{field.value ? (
												format(field.value, "P")
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
										disabled={isLoading}
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
										disabled={isLoading}
										className="w-fit"
										type="number"
										{...field}
										onChange={(e) => field.onChange(Number(e.target.value))}
									/>
									h
								</span>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button disabled={isLoading} type="submit">
					<Save />
					Salva
				</Button>
			</form>
		</Form>
	)
}
