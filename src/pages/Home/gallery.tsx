import type { ReactNode } from 'react';
import { ArrowUpRight, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router';
import { Card } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import FieldDemo from '@/pages/Field/demos/basic';
import SliderDemo from '@/pages/Slider/demos/basic';
import SwitchDemo from '@/pages/Switch/demos/basic';
import { useTheme } from '@/pages/theme';

function Tile({
	title,
	href,
	description,
	className,
	children,
}: {
	title: string;
	href: string;
	description: string;
	className?: string;
	children: ReactNode;
}) {
	return (
		<Card.Root bordered className={cn('min-w-0 gap-6 shadow-none', className)}>
			<Card.Header>
				<Card.Title>
					<h3>
						<Link to={href} className="inline-flex items-center gap-2 hover:underline">
							{title}
							<ArrowUpRight
								aria-hidden="true"
								className="size-4 text-muted-foreground"
							/>
						</Link>
					</h3>
				</Card.Title>
				<Card.Description>{description}</Card.Description>
			</Card.Header>
			<Card.Content className="flex items-center justify-center py-4">
				{children}
			</Card.Content>
		</Card.Root>
	);
}

function ThemeDemo() {
	const { dark, toggle } = useTheme();
	return (
		<div className="flex w-full max-w-sm flex-col gap-6">
			<div className="flex items-center gap-3 text-muted-foreground">
				{dark ? (
					<Moon aria-hidden="true" className="size-8" />
				) : (
					<Sun aria-hidden="true" className="size-8" />
				)}
				<p className="text-sm">One theme, every component.</p>
			</div>
			<Field.Root>
				<Field.Item className="items-center justify-between gap-4">
					<Field.Label>Dark appearance</Field.Label>
					<Switch.Root checked={dark} onCheckedChange={toggle}>
						<Switch.Thumb />
					</Switch.Root>
				</Field.Item>
			</Field.Root>
		</div>
	);
}

export function Gallery() {
	return (
		<div className="grid gap-4 lg:grid-cols-2">
			<Tile
				title="Fields that work together"
				href="/field"
				description="Labels, inputs, and descriptions. Already connected."
				className="lg:row-span-2"
			>
				<FieldDemo />
			</Tile>
			<Tile
				title="Small controls, clear choices"
				href="/switch"
				description="Try changing a preference."
			>
				<SwitchDemo />
			</Tile>
			<Tile
				title="A little more control"
				href="/slider"
				description="Drag the thumb, or use the arrow keys."
			>
				<SliderDemo />
			</Tile>
			<Tile
				title="Light to dark"
				href="/installation"
				description="Change the appearance of this entire page."
				className="lg:col-span-2"
			>
				<ThemeDemo />
			</Tile>
		</div>
	);
}
