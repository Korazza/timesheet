/** @type {import("prettier").Config} */
const prettierConfig = {
	arrowParens: "always",
	bracketSpacing: true,
	endOfLine: "lf",
	htmlWhitespaceSensitivity: "css",
	jsxSingleQuote: false,
	printWidth: 80,
	proseWrap: "preserve",
	quoteProps: "as-needed",
	semi: false,
	singleAttributePerLine: false,
	tabWidth: 2,
	singleQuote: false,
	trailingComma: "es5",
	useTabs: true,
	plugins: ["prettier-plugin-tailwindcss"],
	tailwindFunctions: ["cn"],
}

export default prettierConfig
