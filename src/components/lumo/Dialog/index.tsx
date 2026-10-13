import { Backdrop } from './Backdrop';
import { Close } from './Close';
import { Description } from './Description';
import { Popup } from './Popup';
import { Portal } from './Portal';
import { Root } from './Root';
import { Title } from './Title';
import { Trigger } from './Trigger';
import { Viewport } from './Viewport';

/** Base UI supplies behaviour, these parts supply appearance. Compose with `render`. */
export const Dialog = {
	Root,
	Trigger,
	Portal,
	Close,
	Backdrop,
	Viewport,
	Popup,
	Title,
	Description,
};
