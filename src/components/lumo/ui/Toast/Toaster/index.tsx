import type { ReactNode } from 'react';
import { Toast as BaseToast, type ToastRootToastObject } from '@base-ui/react/toast';
import { Action } from '@/components/lumo/ui/Toast/Action';
import { Close } from '@/components/lumo/ui/Toast/Close';
import { Content } from '@/components/lumo/ui/Toast/Content';
import { Description } from '@/components/lumo/ui/Toast/Description';
import { Icon } from '@/components/lumo/ui/Toast/Icon';
import { Portal } from '@/components/lumo/ui/Toast/Portal';
import { Root } from '@/components/lumo/ui/Toast/Root';
import { Title } from '@/components/lumo/ui/Toast/Title';
import { Viewport, type ViewportProps } from '@/components/lumo/ui/Toast/Viewport';

/** A toast unless you say otherwise: its type, its words, then whatever acts on it. */
function Interior({ toast }: { toast: ToastRootToastObject }) {
	return (
		<>
			<Icon />
			<div className="flex min-w-0 flex-1 items-start gap-2">
				<div className="flex min-w-0 flex-1 flex-col gap-1">
					<Title />
					{/* With no title the description is the whole message, so it takes the body size. */}
					<Description className={toast.title === undefined ? 'text-sm' : undefined} />
				</div>
				<Action />
				<Close />
			</div>
		</>
	);
}

export type ToasterProps = Omit<ViewportProps, 'children'> & {
	/** Draws each toast yourself, given the toast being drawn. */
	children?: (toast: ToastRootToastObject) => ReactNode;
};

/**
 * The stack, mounted once inside a `Provider`. It maps the queue to parts — the one piece of a
 * toast nobody should have to write twice — and leaves everything else to them.
 */
export function Toaster({ className, children, ...props }: ToasterProps) {
	const { toasts } = BaseToast.useToastManager();

	return (
		<Portal>
			<Viewport className={className} {...props}>
				{toasts.map((toast) => (
					<Root key={toast.id} toast={toast}>
						<Content>
							{children === undefined ? <Interior toast={toast} /> : children(toast)}
						</Content>
					</Root>
				))}
			</Viewport>
		</Portal>
	);
}
