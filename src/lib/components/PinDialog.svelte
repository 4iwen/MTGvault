<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	type Props = {
		open: boolean;
		onclose: () => void;
	};
	let { open = $bindable(), onclose }: Props = $props();

	let pin = $state('');
	let submitting = $state(false);
	let error = $state<string | null>(null);

	async function submit(e: Event) {
		e.preventDefault();
		if (pin.length !== 4) {
			error = 'Enter 4 digits';
			return;
		}
		submitting = true;
		error = null;
		try {
			const res = await fetch('/api/login', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ pin })
			});
			if (!res.ok) {
				error = res.status === 401 ? 'Wrong PIN' : 'Login failed';
				pin = '';
				return;
			}
			pin = '';
			open = false;
			onclose();
			await invalidateAll();
		} finally {
			submitting = false;
		}
	}

	function back() {
		pin = pin.slice(0, -1);
	}

	function press(d: string) {
		if (pin.length < 4) pin += d;
	}

	$effect(() => {
		if (open) {
			pin = '';
			error = null;
		}
	});

	const keys: (string | 'back' | 'go')[] = [
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'back',
		'0',
		'go'
	];
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
		role="dialog"
		aria-modal="true"
	>
		<form onsubmit={submit} class="w-80 rounded-lg border bg-background p-6 shadow-lg">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-medium">Enter PIN</h2>
				<button type="button" class="text-sm text-muted-foreground" onclick={() => (open = false)}>
					Cancel
				</button>
			</div>
			<div
				class="mb-4 flex h-12 items-center justify-center gap-2 rounded bg-muted font-mono text-2xl tracking-widest"
			>
				{#each Array(4) as _, i (i)}
					<span class="w-4 text-center">
						{pin[i] ? '•' : ''}
					</span>
				{/each}
			</div>
			{#if error}
				<p class="mb-2 text-center text-sm text-destructive">{error}</p>
			{/if}
			<div class="grid grid-cols-3 gap-2">
				{#each keys as k (k)}
					{#if k === 'back'}
						<button
							type="button"
							class="rounded bg-muted p-3 hover:bg-muted/70"
							onclick={back}
							disabled={submitting || pin.length === 0}
						>
							⌫
						</button>
					{:else if k === 'go'}
						<button
							type="submit"
							class="rounded bg-primary p-3 text-primary-foreground disabled:opacity-50"
							disabled={submitting || pin.length !== 4}
						>
							{submitting ? '...' : 'OK'}
						</button>
					{:else}
						<button
							type="button"
							class="rounded bg-muted p-3 hover:bg-muted/70"
							onclick={() => press(k)}
							disabled={submitting || pin.length >= 4}
						>
							{k}
						</button>
					{/if}
				{/each}
			</div>
		</form>
	</div>
{/if}
