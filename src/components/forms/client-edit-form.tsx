"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Save } from "lucide-react"
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
import { Client } from "@/types"
import { useDialog } from "@/hooks/use-dialog"
import { useClients } from "@/hooks/use-clients"
import { updateClient } from "@/actions/clients"
import { Textarea } from "../ui/textarea"

interface ClientEditFormProps {
	client: Client
}

export function ClientEditForm({ client }: ClientEditFormProps) {
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
			name: client.name,
			description: client.description ?? undefined,
		},
	})
	const { setClients } = useClients()
	const { closeDialog } = useDialog()

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const updatedClient: Client = {
				...client,
				...values,
			}

			await updateClient(updatedClient)

			setClients((prev) =>
				prev.map((e) => (e.id === updatedClient.id ? updatedClient : e))
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
					<Save />
					{tCommon("save")}
				</Button>
			</form>
		</Form>
	)
}
