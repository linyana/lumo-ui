import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cn } from '@/lib/cn';

export type TriggerProps<Payload = unknown> = BaseMenu.Trigger.Props<Payload>;

const triggerClass = `
	flex h-8 items-center justify-center
	rounded-md border bg-background
	px-3 text-sm font-normal text-foreground select-none
	transition-[color,background-color,border-color]
	ease-[var(--ease-spring)] duration-[var(--duration-state)]
	hover:bg-neutral-100 active:bg-neutral-200 data-pressed:bg-neutral-100
	dark:hover:bg-neutral-800 dark:active:bg-neutral-700 dark:data-pressed:bg-neutral-800
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
