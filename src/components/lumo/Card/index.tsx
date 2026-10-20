import { Action } from './Action';
import { Content } from './Content';
import { Description } from './Description';
import { Footer } from './Footer';
import { Header } from './Header';
import { Root, cardVariants } from './Root';
import { Title } from './Title';

/** A surface that groups one thing. Every part is a plain element; the card adds the look. */
export const Card = {
	Root,
	Header,
	Title,
	Description,
	Action,
	Content,
	Footer,
};

export { cardVariants };
export type { CardSize, RootProps } from './Root';
