"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Save } from "lucide-react"

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
import { Client } from "@/db/schema"
import { useDialog } from "@/hooks/use-dialog"
import { useClients } from "@/hooks/use-clients"
import { updateClient } from "@/actions/clients"
import { Textarea } from "../ui/textarea"

interface ClientEditFormProps {
	client: Client
}

const formSchema = z.object({
	name: z.string({
		required_error: "Inserire un nome",
		message: "Valore errato",
	}),
	description: z
		.string({
			message: "Valore errato",
		})
		.optional(),
})

export function ClientEditForm({ client }: ClientEditFormProps) {
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
			toast.success("Cliente aggiornato con successo")
		} catch (e) {
			toast.error(String(e))
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input placeholder="Nome..." {...field} />
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

				<Button type="submit">
					<Save />
					Salva
				</Button>
			</form>
		</Form>
	)
}
