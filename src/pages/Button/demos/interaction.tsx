import { useState } from 'react';
import { Button } from '@/components/lumo/ui/Button';

export default function Interaction() {
	const [saving, setSaving] = useState(false);

	return (
		<>
			<Button
				loading={saving}
				onClick={() => {
					setSaving(true);
					setTimeout(() => setSaving(false), 1200);
				}}
			>
				save draft
			</Button>
			<Button variant="outline">hover me</Button>
			<Button variant="ghost">press me</Button>
		</>
	);
}
