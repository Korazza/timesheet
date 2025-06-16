import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { NextIntlClientProvider } from "next-intl"
import { getLocale } from "next-intl/server"
import { Geist, Libre_Baskerville, Source_Code_Pro } from "next/font/google"

import { configureDateFns } from "@/i18n/date"
import { ClientLocaleProvider } from "@/providers/client-locale-provider"
import "./globals.css"

const sans = Geist({
	variable: "--font-sans",
	subsets: ["latin"],
})

const serif = Libre_Baskerville({
	variable: "--font-serif",
	weight: "400",
	subsets: ["latin"],
})

const mono = Source_Code_Pro({
	variable: "--font--mono",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "Timesheet",
	description: "Assertcode Timesheet",
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const locale = await getLocale()
	configureDateFns(locale)

	return (
		<html lang={locale} suppressHydrationWarning>
			<body
				className={`${sans.variable} ${serif.variable} ${mono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<NextIntlClientProvider>
						<ClientLocaleProvider locale={locale} />
						{children}
					</NextIntlClientProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
