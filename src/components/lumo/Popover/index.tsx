import { Popover as BasePopover } from '@base-ui/react/popover';
import { Arrow } from './Arrow';
import { Backdrop } from './Backdrop';
import { Close } from './Close';
import { Description } from './Description';
import { Popup } from './Popup';
import { Portal } from './Portal';
import { Positioner } from './Positioner';
import { Root } from './Root';
import { Title } from './Title';
import { Trigger } from './Trigger';
import { Viewport } from './Viewport';

/** Base UI supplies behaviour, these parts supply appearance. Compose with `render`. */
export const Popover = {
	Root,
	Trigger,
	Close,
	Portal,
	Backdrop,
	Positioner,
	Popup,
	Viewport,
	Arrow,
	Title,
	Description,
	/** One popup opened by several detached triggers, each with its own payload. */
	createHandle: BasePopover.createHandle,
};
