import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Timesheet",
		short_name: "Timesheet",
		description: "Timesheet",
		orientation: "any",
		lang: "it-IT",
		start_url: "/",
		display: "standalone",
		theme_color: "#f3bb46",
		background_color: "#e7efed",
		icons: [
			{
				purpose: "maskable",
				src: "/icon512_maskable.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				purpose: "any",
				src: "/icon512_rounded.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	}
}
