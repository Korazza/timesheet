"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Plus } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { clientsTable } from "@/db/schema"
import { useDialog } from "@/hooks/use-dialog"
import { useClients } from "@/hooks/use-clients"
import { addClient } from "@/actions/clients"
import { Textarea } from "@/components/ui/textarea"

export function ClientCreateForm() {
	const t = useTranslations("Form.Client")
	const tCommon = useTranslations("Common")

	const formSchema = z.object({
		name: z.string({
			required_error: t("errors.requiredName"),
			message: t("errors.invalidValue"),
		}),
		description: z
			.string({
				message: t("errors.invalidValue"),
			})
			.optional(),
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: undefined,
			description: undefined,
		},
	})
	const { setClients } = useClients()
	const { closeDialog } = useDialog()

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const client: typeof clientsTable.$inferInsert = {
				...values,
			}

			const [createdEntry] = await addClient(client)

			setClients((prev) => [...prev, createdEntry])

			closeDialog()
			toast.success(t("success.created"))
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
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("name")}</FormLabel>
							<FormControl>
								<Input
									disabled={isLoading}
									placeholder={tCommon("namePlaceholder") || "Nome..."}
									{...field}
								/>
							</FormControl>
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
									placeholder={
										tCommon("descriptionPlaceholder") || "Descrizione..."
									}
									className="resize-none"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button disabled={isLoading} type="submit">
					<Plus />
					{tCommon("add")}
				</Button>
			</form>
		</Form>
	)
}
