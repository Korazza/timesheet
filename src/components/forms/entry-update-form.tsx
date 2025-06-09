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
import { CalendarIcon, Check, ChevronsUpDown, Save } from "lucide-react"
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
import { Entry } from "@/db/schema"
import { Input } from "../ui/input"

interface EntryUpdateFormProps {
	entry: Entry
}

const clients = [
	{ name: "Deloitte", clientId: "1" },
	{ name: "Almaviva", clientId: "2" },
	{ name: "Enel", clientId: "3" },
	{ name: "Fincons", clientId: "4" },
] as const

const entryTypes = [
	{ label: "Lavorativo", value: "WORK" },
	{ label: "Permesso", value: "PERMIT" },
	{ label: "Ferie", value: "HOLIDAY" },
	{ label: "Malattia", value: "SICK" },
] as const

const formSchema = z.object({
	date: z.date({ required_error: "Inserire una data" }),
	entryType: z.string({
		required_error: "Inserire tipologia",
	}),
	clientId: z.string().nullable(),
	hours: z
		.number()
		.min(0.5, "Le ore devono essere maggiori di 0.5")
		.max(20, "Le ore devono essere minori di 20"),
})

export function EntryUpdateForm({ entry }: EntryUpdateFormProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: entry.date,
			entryType: entry.type,
			clientId: entry.clientId,
			hours: entry.hours,
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		toast("Test")
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
												<span>Pick a date</span>
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
					name="entryType"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tipologia</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Seleziona una tipologia" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{entryTypes.map((entryType) => (
										<SelectItem key={entryType.value} value={entryType.value}>
											{entryType.label}
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
												? clients.find(
														(client) => client.clientId === field.value
												  )?.name
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
														key={client.clientId}
														onSelect={(...args) => {
															form.setValue("clientId", client.clientId)
														}}
													>
														{client.name}
														<Check
															className={cn(
																"ml-auto",
																client.clientId === field.value
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
					name="hours"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ore</FormLabel>
							<FormControl>
								<Input
									{...field}
									className="w-fit"
									placeholder="8.0"
									type="number"
									onChange={(e) => field.onChange(Number(e.target.value))}
								/>
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
