import { createContext, useContext, type ReactNode } from 'react';

export type ThemeContextValue = {
	dark: boolean;
	toggle: () => void;
};

export const ThemeContext = createContext<ThemeContextValue>({ dark: false, toggle: () => {} });

export function useTheme() {
	return useContext(ThemeContext);
}

/** Wraps the pages so a header can draw the theme button without the shell passing it down. */
export function ThemeProvider({
	value,
	children,
}: {
	value: ThemeContextValue;
	children: ReactNode;
}) {
	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
