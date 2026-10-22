import { Button } from '@/components/lumo/ui/Button';
import { Toast } from '@/components/lumo/ui/Toast';

const kinds = [
	{ label: 'plain', toast: { title: 'draft saved' } },
	{
		label: 'success',
		toast: { type: 'success', title: 'deployment finished', description: 'main · 2m 14s' },
	},
	{
		label: 'error',
		toast: {
			type: 'error',
			title: 'upload failed',
			description: 'the connection reset at 84%.',
		},
	},
	{
		label: 'warning',
		toast: {
			type: 'warning',
			title: 'storage almost full',
			description: '2.1 gb of 2.5 gb used.',
		},
	},
	{ label: 'info', toast: { type: 'info', title: 'maintenance sunday, 03:00 utc' } },
	{ label: 'loading', toast: { type: 'loading', title: 'rebuilding the index' } },
	{ label: 'description only', toast: { description: 'your session expires in 2 minutes.' } },
];

export default function Kinds() {
	const toast = Toast.useToastManager();

	return (
		<div className="flex flex-wrap justify-center gap-2">
			{kinds.map(({ label, toast: options }) => (
				<Button key={label} variant="outline" onClick={() => toast.add(options)}>
					{label}
				</Button>
			))}
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
