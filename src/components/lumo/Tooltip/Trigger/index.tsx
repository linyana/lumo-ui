import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { ComponentProps } from 'react';

export type TriggerProps = ComponentProps<typeof BaseTooltip.Trigger>;

export const Trigger = ({ ...props }: TriggerProps) => (
	<BaseTooltip.Trigger delay={100} {...props} />
);
