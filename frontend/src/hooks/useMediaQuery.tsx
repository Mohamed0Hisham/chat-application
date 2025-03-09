import { useState, useEffect, useMemo } from "react";

const useMediaQuery = (query: string, debug = false): boolean => {
	const mediaQuery = useMemo(() => {
		if (typeof window === "undefined") {
			return {
				matches: false,
				addEventListener: () => {},
				removeEventListener: () => {},
				media: query,
				onchange: null,
				addListener: () => {},
				removeListener: () => {},
				dispatchEvent: () => true,
			} as unknown as MediaQueryList;
		}
		return window.matchMedia(query);
	}, [query]);

	const [matches, setMatches] = useState(mediaQuery.matches);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const handleChange = (event: MediaQueryListEvent) => {
			setMatches(event.matches);
			if (debug) {
				console.log(
					`[useMediaQuery] Query "${query}" changed to: ${event.matches}`
				);
			}
		};

		if (debug) {
			console.log(
				`[useMediaQuery] Initial value for "${query}": ${mediaQuery.matches}`
			);
		}

		mediaQuery.addEventListener("change", handleChange);

		return () => {
			mediaQuery.removeEventListener("change", handleChange);
			if (debug) {
				console.log(`[useMediaQuery] Cleanup for "${query}"`);
			}
		};
	}, [query, debug, mediaQuery]);

	return matches;
};

export default useMediaQuery;
