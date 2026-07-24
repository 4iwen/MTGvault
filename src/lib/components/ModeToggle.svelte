<script lang="ts">
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
</script>

<Button onclick={toggleMode} variant="outline" size="icon">
	<Sun class="h-4 w-4 dark:hidden" />
	<Moon class="hidden h-4 w-4 dark:block" />
</Button>
