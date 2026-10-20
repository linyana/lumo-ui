import { Menu as BaseMenu } from '@base-ui/react/menu';
import { Group } from './Group';
import { GroupLabel } from './GroupLabel';
import { Item } from './Item';
import { Popup } from './Popup';
import { Portal } from './Portal';
import { Positioner } from './Positioner';
import { Root } from './Root';
import { Separator } from './Separator';
import { Trigger } from './Trigger';
import { Viewport } from './Viewport';

/** Base UI supplies behaviour, these parts supply appearance. Compose with `render`. */
export const Dropdown = {
	Root,
	Trigger,
	Portal,
	Positioner,
	Popup,
	Viewport,
	Group,
	GroupLabel,
	Item,
	Separator,
	/** One popup opened by several detached triggers, each with its own payload. */
	createHandle: BaseMenu.createHandle,
};
