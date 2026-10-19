import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cn } from '@/lib/cn';

export type TriggerProps<Payload = unknown> = BaseMenu.Trigger.Props<Payload>;

const triggerClass = `
	relative flex h-8 items-center justify-center
	rounded-md border bg-background
	px-3 text-sm font-normal text-foreground select-none
	transition-[color,background-color,border-color]
	ease-[var(--ease-spring)] duration-[var(--duration-state)]
	after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]
	after:bg-current after:opacity-0 after:transition-opacity
	after:duration-[var(--duration-state)]
	hover:after:opacity-[var(--state-layer-hover-opacity)]
	active:after:opacity-[var(--state-layer-pressed-opacity)]
	data-pressed:after:opacity-[var(--state-layer-hover-opacity)]
`;

export function Trigger<Payload>({ className, ...props }: TriggerProps<Payload>) {
	return (
		<BaseMenu.Trigger
			data-slot="menu-trigger"
			className={cn(triggerClass, className)}
			{...props}
		/>
	);
}
