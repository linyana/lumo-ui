import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { Arrow } from './Arrow';
import { Popup } from './Popup';
import { Portal } from './Portal';
import { Positioner } from './Positioner';
import { Provider } from './Provider';
import { Root } from './Root';
import { Trigger } from './Trigger';
import { Viewport } from './Viewport';

/** Base UI supplies behaviour, these parts supply appearance. Compose with `render`. */
export const Tooltip = {
	Provider,
	Root,
	Trigger,
	Portal,
	Positioner,
	Popup,
	Viewport,
	Arrow,
	/** One popup opened by several detached triggers, each with its own payload. */
	createHandle: BaseTooltip.createHandle,
};
