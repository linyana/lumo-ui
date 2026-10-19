import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cn } from '@/lib/cn';

export type TriggerProps<Payload = unknown> = BaseMenu.Trigger.Props<Payload>;

const docsTriggerClass = `
	flex h-8 items-center justify-center
	rounded-none border border-neutral-950 bg-white
	px-3 text-sm font-normal text-neutral-950 select-none
	hover:bg-neutral-100 active:bg-neutral-200 data-pressed:bg-neutral-100
	dark:border-white dark:bg-neutral-950 dark:text-white
	dark:hover:bg-neutral-800 dark:active:bg-neutral-700 dark:data-pressed:bg-neutral-800
	focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950
	dark:focus-visible:outline-white
`;

export function Trigger<Payload>({ className, ...props }: TriggerProps<Payload>) {
	return (
		<BaseMenu.Trigger
			data-slot="menu-trigger"
			className={cn(docsTriggerClass, className)}
			{...props}
		/>
	);
}
