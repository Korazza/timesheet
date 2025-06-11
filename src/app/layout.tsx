import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { NextIntlClientProvider } from "next-intl"
import { getLocale } from "next-intl/server"
import { Inter, JetBrains_Mono } from "next/font/google"

import "./globals.css"

const sans = Inter({
	variable: "--font-sans",
	subsets: ["latin"],
})

const mono = JetBrains_Mono({
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

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className={`${sans.variable} ${mono.variable} antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<NextIntlClientProvider>{children}</NextIntlClientProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
