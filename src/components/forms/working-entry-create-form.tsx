"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { format } from "date-fns"
import { it } from "date-fns/locale"
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
import { CalendarIcon, Check, ChevronsUpDown, Plus } from "lucide-react"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { activityTypeEnum, entriesTable, EntryWithClient } from "@/db/schema"
import { useClients } from "@/hooks/use-clients"
import { addEntry } from "@/actions/entries"
import { useUser } from "@/hooks/use-user"
import { useEntries } from "@/hooks/use-entries"
import { useDialog } from "@/hooks/use-dialog"
import { activityTypeOptions } from "@/enums"

const MIN_HOURS = 0.5
const MAX_HOURS = 24

const formSchema = z.object({
	date: z.date({
		required_error: "Inserire una data",
		message: "Valore errato",
	}),
	clientId: z.string().nullable(),
	activityType: z.enum(activityTypeEnum.enumValues),
	description: z.string().min(1, "La descrizione non può essere vuota"),
	hours: z
		.number()
		.min(MIN_HOURS, `Le ore devono essere maggiori di ${MIN_HOURS}`)
		.max(MAX_HOURS, `Le ore devono essere minori di ${MAX_HOURS}`),
	overtimeHours: z
		.number()
		.min(MIN_HOURS, `Le ore devono essere maggiori di ${MIN_HOURS}`)
		.max(MAX_HOURS, `Le ore devono essere minori di ${MAX_HOURS}`)
		.optional(),
})

export function WorkingEntryCreateForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: new Date(),
			description: undefined,
			hours: 8,
			overtimeHours: undefined,
		},
	})
	const { user } = useUser()
	const { clients } = useClients()
	const { setEntries } = useEntries()
	const { closeDialog } = useDialog()

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const entry: typeof entriesTable.$inferInsert = {
				...values,
				employeeId: user.id,
				type: "WORK",
				date: values.date.toISOString(),
			}

			const [createdEntry] = await addEntry(entry)

			const client = clients.find((c) => c.id === entry.clientId)

			const createdEntryWithClient: EntryWithClient = {
				...createdEntry,
				client,
			}

			setEntries((prevEntries) =>
				[...prevEntries, createdEntryWithClient].sort(
					(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
				)
			)

			closeDialog()
			toast.success("Attività aggiunta con successo")
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
					name="clientId"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Cliente</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant="outline"
											role="combobox"
											className={cn(
												"w-[200px] justify-between",
												!field.value && "text-muted-foreground"
											)}
										>
											{field.value
												? clients.find((client) => client.id === field.value)
														?.name
												: "Seleziona cliente"}
											<ChevronsUpDown className="opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-[200px] p-0">
									<Command>
										<CommandInput
											placeholder="Cerca cliente..."
											className="h-9"
										/>
										<CommandList>
											<CommandEmpty>Nessun cliente trovato</CommandEmpty>
											<CommandGroup>
												{clients.map((client) => (
													<CommandItem
														value={client.name}
														key={client.id}
														onSelect={(...args) => {
															form.setValue("clientId", client.id)
														}}
													>
														{client.name}
														<Check
															className={cn(
																"ml-auto",
																client.id === field.value
																	? "opacity-100"
																	: "opacity-0"
															)}
														/>
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="activityType"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tipologia</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Seleziona tipologia" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{activityTypeOptions.map((activityType) => (
										<SelectItem
											key={activityType.value}
											value={activityType.value}
										>
											{activityType.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Descrizione</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Descrizione..."
									className="resize-none"
									{...field}
								/>
							</FormControl>
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

				<FormField
					control={form.control}
					name="overtimeHours"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Straordinari</FormLabel>
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
