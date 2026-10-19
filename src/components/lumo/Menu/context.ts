import { createContext, useContext } from 'react';

export type MenuContextValue = {
	/** The rail: rows keep one glyph, and a row with children opens them in a popover. */
	compact: boolean;
};

export const MenuContext = createContext<MenuContextValue>({ compact: false });

export function useMenu() {
	return useContext(MenuContext);
}
