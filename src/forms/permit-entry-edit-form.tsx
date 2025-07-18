"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { format } from "date-fns"
import { useTranslations } from "next-intl"

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
import { EntryWithClient } from "@/types"
import { updateEntry } from "@/actions/entries"
import { useEntries } from "@/hooks/use-entries"
import { useDialog } from "@/hooks/use-dialog"

const MIN_HOURS = 0.5
const MAX_HOURS = 24

interface PermitEntryEditFormProps {
	entry: EntryWithClient
}

export function PermitEntryEditForm({ entry }: PermitEntryEditFormProps) {
	const t = useTranslations("Form.Permit")
	const tCommon = useTranslations("Common")

	const formSchema = z.object({
		date: z.date({
			required_error: t("errors.requiredDate"),
			message: t("errors.invalidValue"),
		}),
		hours: z
			.number()
			.min(MIN_HOURS, t("errors.minHours", { min: MIN_HOURS }))
			.max(MAX_HOURS, t("errors.maxHours", { max: MAX_HOURS })),
	})

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
			}

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

				<Button disabled={isLoading} type="submit">
					<Save />
					{tCommon("save")}
				</Button>
			</form>
		</Form>
	)
}
