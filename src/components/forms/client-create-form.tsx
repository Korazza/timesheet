"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Plus } from "lucide-react"

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
import { Textarea } from "../ui/textarea"

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

export function ClientCreateForm() {
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
			toast.success("Cliente aggiunto con successo")
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
							<FormLabel>Nome</FormLabel>
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
					<Plus />
					Aggiungi
				</Button>
			</form>
		</Form>
	)
}
