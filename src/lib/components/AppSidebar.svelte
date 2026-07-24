<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import PinDialog from '$lib/components/PinDialog.svelte';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import Cards from '@lucide/svelte/icons/gallery-vertical-end';
	import Layers from '@lucide/svelte/icons/layers';
	import Settings from '@lucide/svelte/icons/settings';
	import { resolve } from '$app/paths';
	import Vault from '@lucide/svelte/icons/vault';
	import { Lock, LockOpen } from '@lucide/svelte';

	let dialogOpen = $state(false);

	const items = [
		{ title: 'Dashboard', url: '/', icon: LayoutDashboard },
		{ title: 'Collection', url: '/collection', icon: Cards },
		{ title: 'Decks', url: '/decks', icon: Layers },
		{ title: 'Settings', url: '/settings', icon: Settings }
	] as const;

	async function logout() {
		await fetch('/api/logout', { method: 'POST' });
		await invalidateAll();
	}
</script>

<Sidebar.Root>
	<Sidebar.Header>
		<div class="flex items-center gap-2 px-2 py-1 font-medium">
			<Vault class="h-5 w-5" />
			<span class="text-base">MTGvault</span>
		</div>
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each items as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={resolve(item.url)} {...props}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				{#if page.data.user}
					<Sidebar.MenuButton onclick={logout}>
						{#snippet child({ props })}
							<button {...props}>
								<LockOpen />
								<span>Lock</span>
							</button>
						{/snippet}
					</Sidebar.MenuButton>
				{:else}
					<Sidebar.MenuButton onclick={() => (dialogOpen = true)}>
						{#snippet child({ props })}
							<button {...props}>
								<Lock />
								<span>Edit mode</span>
							</button>
						{/snippet}
					</Sidebar.MenuButton>
				{/if}
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>

<PinDialog bind:open={dialogOpen} onclose={() => (dialogOpen = false)} />
