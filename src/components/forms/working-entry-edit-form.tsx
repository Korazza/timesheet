"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { format } from "date-fns"
import { CalendarIcon, Check, ChevronsUpDown, Save } from "lucide-react"
import { z } from "zod"
import { useTranslations } from "next-intl"

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
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { EntryWithClient } from "@/types"
import { useClients } from "@/hooks/use-clients"
import { updateEntry } from "@/actions/entries"
import { useEntries } from "@/hooks/use-entries"
import { useDialog } from "@/hooks/use-dialog"

const MIN_HOURS = 0.5
const MAX_HOURS = 24

interface WorkingEntryEditFormProps {
	entry: EntryWithClient
}

export function WorkingEntryEditForm({ entry }: WorkingEntryEditFormProps) {
	const t = useTranslations("Form.Working")
	const tCommon = useTranslations("Common")

	const formSchema = z.object({
		date: z.date({
			required_error: t("errors.requiredDate"),
			message: t("errors.invalidValue"),
		}),
		clientId: z
			.string({ required_error: t("errors.requiredClient") })
			.nullable(),
		description: z
			.string({ required_error: t("errors.requiredDescription") })
			.min(1, t("errors.requiredDescription")),
		hours: z
			.number({ required_error: t("errors.requiredHours") })
			.min(MIN_HOURS, t("errors.minHours", { min: MIN_HOURS }))
			.max(MAX_HOURS, t("errors.maxHours", { max: MAX_HOURS })),
		overtimeHours: z
			.number()
			.min(0, t("errors.minHours", { min: MIN_HOURS }))
			.max(MAX_HOURS, t("errors.maxHours", { max: MAX_HOURS })),
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: new Date(entry.date),
			clientId: entry.clientId,
			description: entry.description ?? "",
			hours: entry.hours,
			overtimeHours: entry.overtimeHours ?? 0,
		},
	})
	const { clients } = useClients()
	const { setEntries } = useEntries()
	const { closeDialog } = useDialog()

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const updatedEntry: EntryWithClient = {
				...entry,
				...values,
				overtimeHours: values.overtimeHours || null,
			}

			updatedEntry.client = clients.find((c) => c.id === updatedEntry.clientId)

			await updateEntry(updatedEntry)

			setEntries((prevEntries) =>
				prevEntries.map((e) => (e.id === updatedEntry.id ? updatedEntry : e))
			)

			closeDialog()
			toast.success(t("success.updated"))
		} catch (e) {
			toast.error(tCommon("error"))
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
							<FormLabel>{t("date")}</FormLabel>
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
												<span>
													{t("selectDate", {
														defaultValue: "Seleziona una data",
													})}
												</span>
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
					name="clientId"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>{t("client")}</FormLabel>
							<Popover>
								<PopoverTrigger asChild disabled={isLoading}>
									<FormControl>
										<Button
											disabled={isLoading}
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
												: t("selectClient", {
														defaultValue: "Seleziona cliente",
													})}
											<ChevronsUpDown className="opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-[200px] p-0">
									<Command>
										<CommandInput
											placeholder={t("searchClient", {
												defaultValue: "Cerca cliente...",
											})}
											className="h-9"
										/>
										<CommandList>
											<CommandEmpty>
												{t("noClientFound", {
													defaultValue: "Nessun cliente trovato",
												})}
											</CommandEmpty>
											<CommandGroup>
												{clients.map((client) => (
													<CommandItem
														value={client.name}
														key={client.id}
														onSelect={() => {
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
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("description")}</FormLabel>
							<FormControl>
								<Textarea
									disabled={isLoading}
									placeholder={tCommon("descriptionPlaceholder")}
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
							<FormLabel>{t("hours")}</FormLabel>
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

				<FormField
					control={form.control}
					name="overtimeHours"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("overtimeHours")}</FormLabel>
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
					{tCommon("save")}
				</Button>
			</form>
		</Form>
	)
}
