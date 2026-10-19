import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { Backdrop } from './Backdrop';
import { Close } from './Close';
import { Content } from './Content';
import { Description } from './Description';
import { Indent } from './Indent';
import { IndentBackground } from './IndentBackground';
import { Popup } from './Popup';
import { Portal } from './Portal';
import { Provider } from './Provider';
import { Root } from './Root';
import { SwipeArea } from './SwipeArea';
import { Title } from './Title';
import { Trigger } from './Trigger';
import { Viewport } from './Viewport';
import { VirtualKeyboardProvider } from './VirtualKeyboardProvider';

/** Base UI supplies behaviour, these parts supply appearance. Compose with `render`. */
export const Drawer = {
	Provider,
	IndentBackground,
	Indent,
	Root,
	Trigger,
	SwipeArea,
	Portal,
	Close,
	Backdrop,
	Viewport,
	Popup,
	Content,
	Title,
	Description,
	VirtualKeyboardProvider,
	/** One popup opened by several detached triggers, each with its own payload. */
	createHandle: BaseDrawer.createHandle,
};
