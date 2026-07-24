<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/AppSidebar.svelte';
	import ModeToggle from '$lib/components/ModeToggle.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<ModeWatcher />

<Sidebar.Provider>
	<AppSidebar />
	<main class="flex-1">
		<div class="flex items-center justify-between border-b p-4">
			<Sidebar.Trigger />
			<ModeToggle />
		</div>
		<div class="p-6">
			{@render children()}
		</div>
	</main>
</Sidebar.Provider>
