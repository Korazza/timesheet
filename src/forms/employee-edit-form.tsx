"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Save } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

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
import { Employee } from "@/types"
import { useDialog } from "@/hooks/use-dialog"
import { updateEmployee } from "@/actions/employees"
import { Textarea } from "@/components/ui/textarea"
import { roleEnum } from "@/db/schema"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useEnumOptions } from "@/hooks/use-enum-options"

interface EmployeeEditFormProps {
	employee: Employee
}

export function EmployeeEditForm({ employee }: EmployeeEditFormProps) {
	const router = useRouter()
	const { roleOptions } = useEnumOptions()
	const t = useTranslations("Form.Employee")
	const tCommon = useTranslations("Common")

	const formSchema = z.object({
		firstName: z.string({
			required_error: t("errors.requiredFirstName"),
			message: t("errors.invalidValue"),
		}),
		lastName: z.string({
			required_error: t("errors.requiredLastName"),
			message: t("errors.invalidValue"),
		}),
		role: z.enum(roleEnum.enumValues, {
			required_error: t("errors.requiredRole"),
		}),
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: employee.firstName,
			lastName: employee.lastName,
			role: employee.role,
		},
	})
	const { closeDialog } = useDialog()

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const updatedEmployee: Employee = {
				...employee,
				...values,
			}

			await updateEmployee(updatedEmployee)

			closeDialog()
			router.refresh()
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
					name="firstName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("firstName")}</FormLabel>
							<FormControl>
								<Input
									disabled={isLoading}
									placeholder={tCommon("firstNamePlaceholder")}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="lastName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("lastName")}</FormLabel>
							<FormControl>
								<Input
									disabled={isLoading}
									placeholder={tCommon("lastNamePlaceholder")}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="role"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("role")}</FormLabel>
							<Select
								disabled={isLoading}
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder={t("selectRole")} />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{roleOptions.map((role) => (
										<SelectItem key={role.value} value={role.value}>
											{role.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
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
