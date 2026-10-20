import { Button } from '@/components/lumo/Button';
import { Toast } from '@/components/lumo/Toast';
import { DocPage, DocSection } from '@/pages/DocPage';

function Kinds() {
	const toast = Toast.useToastManager();

	return (
		<div className="flex flex-wrap gap-2">
			<Button variant="outline" onClick={() => toast.add({ title: 'draft saved' })}>
				plain
			</Button>
			<Button
				variant="outline"
				onClick={() =>
					toast.add({
						type: 'success',
						title: 'deployment finished',
						description: 'main · 2m 14s',
					})
				}
			>
				success
			</Button>
			<Button
				variant="outline"
				onClick={() =>
					toast.add({
						type: 'error',
						title: 'upload failed',
						description: 'the connection reset at 84%.',
					})
				}
			>
				error
			</Button>
			<Button
				variant="outline"
				onClick={() =>
					toast.add({
						type: 'warning',
						title: 'storage almost full',
						description: '2.1 gb of 2.5 gb used.',
					})
				}
			>
				warning
			</Button>
			<Button
				variant="outline"
				onClick={() => toast.add({ type: 'tip', title: 'press ⌘k to jump anywhere' })}
			>
				tip
			</Button>
			<Button
				variant="outline"
				onClick={() => toast.add({ type: 'info', title: 'maintenance sunday, 03:00 utc' })}
			>
				info
			</Button>
			<Button
				variant="outline"
				onClick={() => toast.add({ type: 'loading', title: 'rebuilding the index' })}
			>
				loading
			</Button>
			<Button
				variant="outline"
				onClick={() => toast.add({ description: 'your session expires in 2 minutes.' })}
			>
				description only
			</Button>
			<Button
				variant="outline"
				onClick={() => {
					const id = toast.add({
						title: 'file moved to trash',
						actionProps: { children: 'undo', onClick: () => toast.close(id) },
					});
				}}
			>
				with an action
			</Button>
		</div>
	);
}

function Saving() {
	const toast = Toast.useToastManager();

	return (
		<Button
			variant="outline"
			onClick={() =>
				toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
					loading: { type: 'loading', title: 'saving changes' },
					success: { type: 'success', title: 'changes saved' },
					error: { type: 'error', title: 'could not save' },
				})
			}
		>
			save
		</Button>
	);
}

function Flood() {
	const toast = Toast.useToastManager();

	return (
		<Button
			variant="outline"
			onClick={() => {
				for (const title of ['indexing', 'fetching grammar', 'tokenising', 'done']) {
					toast.add({ title });
				}
			}}
		>
			queue four
		</Button>
	);
}

export function ToastPage() {
	return (
		<Toast.Provider>
			<DocPage title="toast" description="a message that says itself and gets out of the way">
				<DocSection
					title="a glyph per kind"
					note={
						<>
							<code>type</code> is a plain string, and the only thing it decides is
							the glyph and its ink. <code>warning</code> is the one that needed a
							token of its own.
						</>
					}
				>
					<Kinds />
				</DocSection>

				<DocSection
					title="a promise reports itself"
					note="one toast that is updated in place: loading, then whatever the promise settles as."
				>
					<Saving />
				</DocSection>

				<DocSection
					title="the stack"
					note={
						<>
							three is the provider's limit: the fourth stays mounted but drawn
							nowhere. older toasts wait behind the newest and clip to its height;
							point at the stack and they unfurl to their own.
						</>
					}
				>
					<Flood />
				</DocSection>
			</DocPage>
			<Toast.Toaster />
		</Toast.Provider>
	);
}
