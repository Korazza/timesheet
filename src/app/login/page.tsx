import Image from "next/image"

import { LoginForm } from "@/components/forms/login-form"

export default function LoginPage() {
	return (
		<div className="bg-muted flex min-h-dvh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-4">
				<div className="flex items-center gap-4 self-center text-lg font-semibold">
					<div className="flex size-6 items-center justify-center">
						<div className="flex aspect-square size-10 items-center justify-center">
							<Image
								className="drop-shadow"
								src="/icon512_rounded.png"
								alt="Assertcode Logo"
								width="36"
								height="36"
							/>
						</div>
					</div>
					Assertcode
				</div>
				<LoginForm />
			</div>
		</div>
	)
}
