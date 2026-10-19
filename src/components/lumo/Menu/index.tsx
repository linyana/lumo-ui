import { Action } from './Action';
import { Badge } from './Badge';
import { Button, menuButtonVariants } from './Button';
import { Group } from './Group';
import { GroupAction } from './GroupAction';
import { GroupLabel } from './GroupLabel';
import { Item } from './Item';
import { List } from './List';
import { Root } from './Root';
import { Separator } from './Separator';
import { Skeleton } from './Skeleton';
import { Sub } from './Sub';
import { SubButton, menuSubButtonVariants } from './SubButton';
import { SubItem } from './SubItem';
import { SubList } from './SubList';

/** Base UI supplies behaviour, these parts supply appearance. Compose with `render`. */
export const Menu = {
	Root,
	List,
	Group,
	GroupLabel,
	GroupAction,
	Item,
	Button,
	Action,
	Badge,
	Skeleton,
	Sub,
	SubList,
	SubItem,
	SubButton,
	Separator,
};

export { menuButtonVariants, menuSubButtonVariants };
export { useMenu } from './context';
export type { MenuContextValue } from './context';
