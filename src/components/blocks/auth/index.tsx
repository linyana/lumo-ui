import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { RingedPlanet } from './planet';

export type AuthLayoutProps = Omit<ComponentProps<'div'>, 'title'> & {
	/** The form's own name, beside the mark — the one heading on the screen. */
	title: ReactNode;
	/** One line under it, saying what the form is for. */
	description?: ReactNode;
	/** The mark before the title, sized by the caller: an `img`, a glyph, a monogram. */
	logo?: ReactNode;
	/** The form itself, with its own stack of fields and its submit. */
	children: ReactNode;
	/** Under the form: the way to the other anonymous screen, a reset, a policy line. */
	footer?: ReactNode;
	/**
	 * What fills the panel beside the form, in place of the artwork — a photograph, a brand, a
	 * statement at full strength. The form keeps its own column either way.
	 */
	aside?: ReactNode;
	/** The panel's own words, under the artwork. Nothing is written there by default. */
	headline?: ReactNode;
	note?: ReactNode;
};

/**
 * The frame the two anonymous screens stand in: a form column, and a panel beside it on a wide
 * frame. The panel is the artwork and nothing else — no copy of the library's own — so the same
 * frame carries a sign-in, a register or a reset.
 *
 * It measures itself rather than the window, because the frame is often not the page: the panel
 * appears when the frame itself is 36rem wide, which is a laptop's page and not a card's.
 */
export function AuthLayout({
	title,
	description,
	logo,
	footer,
	aside,
	headline,
	note,
	className,
	children,
	...props
}: AuthLayoutProps) {
	return (
		<div
			data-slot="auth"
			className={cn('@container flex min-h-svh bg-layout-content', className)}
			{...props}
		>
			<aside
				data-slot="auth-panel"
				className={cn(
					'm-3 hidden flex-1 flex-col overflow-hidden rounded-xl p-8',
					'bg-scene-background text-scene-foreground @xl:flex @3xl:p-10 @4xl:p-14',
				)}
			>
				{aside ?? (
					<>
						<div
							data-slot="auth-artwork"
							className="-mx-8 flex flex-1 items-center justify-center py-10 @3xl:-mx-10 @4xl:-mx-14"
						>
							<RingedPlanet />
						</div>

						{(headline !== undefined || note !== undefined) && (
							<div data-slot="auth-panel-words">
								{headline !== undefined && (
									<p className="max-w-sm font-serif text-4xl leading-[1.05] tracking-tight text-balance @3xl:text-5xl @4xl:text-6xl">
										{headline}
									</p>
								)}
								{note !== undefined && (
									<p className="mt-5 max-w-64 text-sm leading-relaxed text-scene-foreground/65">
										{note}
									</p>
								)}
							</div>
						)}
					</>
				)}
			</aside>

			<main data-slot="auth-main" className="relative m-3 flex flex-1 flex-col">
				<div className="flex flex-1 items-center justify-center py-12">
					<div className="w-full max-w-sm">
						<div data-slot="auth-head" className="space-y-1.5">
							<div className="flex items-center gap-3">
								{logo !== undefined && (
									<span
										data-slot="auth-logo"
										className="flex shrink-0 items-center"
									>
										{logo}
									</span>
								)}
								<h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
							</div>
							{description !== undefined && (
								<p className="text-sm text-pretty text-muted-foreground">
									{description}
								</p>
							)}
						</div>

						<div data-slot="auth-body" className="mt-8">
							{children}
						</div>

						{footer !== undefined && (
							<p
								data-slot="auth-footer"
								className="mt-8 text-sm text-muted-foreground"
							>
								{footer}
							</p>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}

export { RingedPlanet } from './planet';
