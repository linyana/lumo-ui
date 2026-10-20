import { Toast as BaseToast } from '@base-ui/react/toast';
import { Action } from './Action';
import { Close } from './Close';
import { Content } from './Content';
import { Description } from './Description';
import { Icon } from './Icon';
import { Portal } from './Portal';
import { Provider } from './Provider';
import { Root } from './Root';
import { Title } from './Title';
import { Toaster } from './Toaster';
import { Viewport } from './Viewport';

/** Base UI supplies behaviour, these parts supply appearance. Compose with `render`. */
export const Toast = {
	Provider,
	Portal,
	Viewport,
	Root,
	Content,
	Icon,
	Title,
	Description,
	Action,
	Close,
	/** Provider, portal and viewport assembled, with the queue already mapped to parts. */
	Toaster,
	useToastManager: BaseToast.useToastManager,
	/** Queues a toast from outside React — pass it to `Provider` and use it anywhere. */
	createToastManager: BaseToast.createToastManager,
};
