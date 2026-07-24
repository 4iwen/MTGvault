<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import { LineChart } from 'layerchart';
	import { curveNatural } from 'd3-shape';
	import Plus from '@lucide/svelte/icons/plus';

	const stats = [
		{ label: 'Total cards', value: '1,284' },
		{ label: 'Decks', value: '7' },
		{ label: 'Est. value', value: '$612' }
	];

	const valueHistory = [
		{ date: 'Jan', value: 210 },
		{ date: 'Feb', value: 260 },
		{ date: 'Mar', value: 300 },
		{ date: 'Apr', value: 340 },
		{ date: 'May', value: 410 },
		{ date: 'Jun', value: 480 },
		{ date: 'Jul', value: 612 }
	];

	const chartConfig = {
		value: { label: 'Collection value', color: 'var(--chart-1)' }
	} satisfies Chart.ChartConfig;
</script>

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-lg font-medium">Dashboard</h1>
	<Button size="sm">
		<Plus class="mr-1 h-4 w-4" />
		Add card
	</Button>
</div>

<div class="mb-8 grid grid-cols-3 gap-4">
	{#each stats as stat (stat.label)}
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Description>{stat.label}</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-medium">{stat.value}</div>
			</Card.Content>
		</Card.Root>
	{/each}
</div>

<Card.Root>
	<Card.Header>
		<Card.Title>Collection value over time</Card.Title>
		<Card.Description>Estimated market value, last 7 months</Card.Description>
	</Card.Header>
	<Card.Content>
		<Chart.Container config={chartConfig} class="h-75 w-full">
			<LineChart
				data={valueHistory}
				x="date"
				series={[{ key: 'value', label: 'Collection value', color: chartConfig.value.color }]}
				props={{
					spline: { curve: curveNatural },
					xAxis: { format: (d) => d },
					yAxis: { format: (d) => `$${d}` }
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip />
				{/snippet}
			</LineChart>
		</Chart.Container>
	</Card.Content>
</Card.Root>
