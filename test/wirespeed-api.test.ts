import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';
import type { WirespeedApi as ApiClient } from '../src/lib/server/wirespeed/api.js';

// Transpile the client in memory so these tests exercise the production module
// without requiring a SvelteKit build or generated JavaScript files.
const source = await readFile(
	new URL('../src/lib/server/wirespeed/api.ts', import.meta.url),
	'utf8'
);
const { outputText } = ts.transpileModule(source, {
	compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext }
});
const { WirespeedApi } = (await import(
	`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
)) as typeof import('../src/lib/server/wirespeed/api.js');

const period = {
	startDate: '2026-08-01T00:00:00.000Z',
	endDate: '2026-08-31T23:59:59.999Z'
};
const search = {
	createdAt: { gte: period.startDate, lte: period.endDate },
	orderBy: 'createdAt',
	orderDir: 'desc' as const
};

interface RequestContract {
	name: string;
	path: string;
	method: 'GET' | 'POST';
	body?: object;
	invoke: (api: ApiClient) => Promise<unknown>;
}

const contracts: RequestContract[] = [
	{
		name: 'current resource counts omit historical filters',
		path: '/v1/team/statistics/resources',
		method: 'POST',
		invoke: (api) => api.getTeamStatisticsResources()
	},
	{
		name: 'detection statistics retain the report period',
		path: '/v1/team/statistics/detections',
		method: 'POST',
		body: period,
		invoke: (api) => api.getTeamStatisticsDetections(period)
	},
	{
		name: 'event statistics retain the report period',
		path: '/v1/team/statistics/events',
		method: 'POST',
		body: period,
		invoke: (api) => api.getTeamStatisticsEvents(period)
	},
	{
		name: 'case severity statistics use search filters',
		path: '/v1/cases/stats/severity',
		method: 'POST',
		body: search,
		invoke: (api) => api.getCasesStatsBySeverity(search)
	},
	{
		name: 'detection category statistics use search filters',
		path: '/v1/detection/stats/category-class',
		method: 'POST',
		body: search,
		invoke: (api) => api.getDetectionStatsByCategoryClass(search)
	},
	{
		name: 'current team',
		path: '/v1/team',
		method: 'GET',
		invoke: (api) => api.getCurrentTeam()
	},
	{
		name: 'team search',
		path: '/v1/team',
		method: 'POST',
		body: { page: 2, size: 10, search: 'Client' },
		invoke: (api) => api.searchTeams({ page: 2, size: 10, search: 'Client' })
	},
	{
		name: 'team switching',
		path: '/v1/team/switch',
		method: 'POST',
		body: { teamId: 'client-team' },
		invoke: (api) => api.switchTeam('client-team')
	},
	{
		name: 'mean time to remediate',
		path: '/v1/detection/mean-time-to-remediate',
		method: 'POST',
		body: period,
		invoke: (api) => api.getMttr(period)
	},
	{
		name: 'mean time to detect',
		path: '/v1/detection/mean-time-to-detect',
		method: 'POST',
		body: period,
		invoke: (api) => api.getMttd(period)
	},
	{
		name: 'mean time to verdict',
		path: '/v1/detection/mean-time-to-verdict',
		method: 'POST',
		body: period,
		invoke: (api) => api.getMttv(period)
	},
	{
		name: 'mean time to close',
		path: '/v1/detection/mean-time-to-close',
		method: 'POST',
		body: period,
		invoke: (api) => api.getMttc(period)
	},
	{
		name: 'case search',
		path: '/v1/cases',
		method: 'POST',
		body: search,
		invoke: (api) => api.getCases(search)
	},
	{
		name: 'detection search',
		path: '/v1/detection',
		method: 'POST',
		body: search,
		invoke: (api) => api.getDetections(search)
	},
	{
		name: 'detection detail encodes identifiers as one path component',
		path: '/v1/detection/det%2F42%20%3F%23',
		method: 'GET',
		invoke: (api) => api.getDetection('det/42 ?#')
	},
	{
		name: 'integration search includes disabled integrations when requested',
		path: '/v1/integration',
		method: 'POST',
		body: { includeDisabled: true, page: 1 },
		invoke: (api) => api.getIntegrations({ includeDisabled: true, page: 1 })
	},
	{
		name: 'endpoint count filters OS categories',
		path: '/v1/endpoint/count',
		method: 'POST',
		body: { operatingSystemCategories: ['Windows', 'Windows Server'] },
		invoke: (api) =>
			api.getEndpointCount({ operatingSystemCategories: ['Windows', 'Windows Server'] })
	}
];

test('API requests follow the v1 paths, methods, filters, and Bearer authentication', async (t) => {
	for (const contract of contracts) {
		await t.test(contract.name, async (t) => {
			const response = { marker: contract.name };
			let calls = 0;
			t.mock.method(globalThis, 'fetch', async (input: unknown, init?: RequestInit) => {
				calls += 1;
				assert.equal(String(input), `https://api.wirespeed.co${contract.path}`);
				assert.equal(init?.method, contract.method);
				const headers = new Headers(init?.headers);
				assert.equal(headers.get('Authorization'), 'Bearer test-api-key');
				if (contract.body === undefined) {
					assert.equal(init?.body, undefined);
				} else {
					assert.equal(headers.get('Content-Type'), 'application/json');
					assert.deepEqual(JSON.parse(String(init?.body)), contract.body);
				}
				return Response.json(response);
			});
			assert.deepEqual(await contract.invoke(new WirespeedApi('test-api-key')), response);
			assert.equal(calls, 1);
		});
	}
});

test('all search helpers start at page 1 and read later pages without totalCount, including after a short page', async (t) => {
	const helpers = [
		{ method: 'getAllCases', path: '/v1/cases' },
		{ method: 'getAllDetections', path: '/v1/detection' },
		{ method: 'getAllIntegrations', path: '/v1/integration' },
		{ method: 'searchAllTeams', path: '/v1/team' }
	] as const;

	for (const helper of helpers) {
		await t.test(helper.method, async (t) => {
			const pages = [[{ id: 'first' }], [{ id: 'second' }, { id: 'third' }], []];
			const requestedPages: number[] = [];
			t.mock.method(globalThis, 'fetch', async (input: unknown, init?: RequestInit) => {
				assert.equal(String(input), `https://api.wirespeed.co${helper.path}`);
				const query = JSON.parse(String(init?.body));
				if (query.page < 1) {
					return Response.json({ message: 'Page must not be less than 1' }, { status: 400 });
				}
				assert.equal(query.search, 'needle');
				assert.equal(query.orderBy, 'id');
				assert.equal(query.orderDir, 'asc');
				assert.equal(query.size, 100);
				requestedPages.push(query.page);
				assert.ok(query.page <= pages.length, 'pagination should stop at the empty page');
				return Response.json({ data: pages[query.page - 1] });
			});
			const api = new WirespeedApi('test-api-key');
			const result = await api[helper.method]({
				search: 'needle',
				orderBy: 'id',
				orderDir: 'asc'
			});
			assert.deepEqual(result.data, pages.flat());
			assert.deepEqual(requestedPages, [1, 2, 3]);
		});
	}
});

test('pagination rejects a repeated page instead of requesting pages indefinitely', async (t) => {
	const requestedPages: number[] = [];
	t.mock.method(globalThis, 'fetch', async (_input: unknown, init?: RequestInit) => {
		const { page } = JSON.parse(String(init?.body));
		requestedPages.push(page);
		assert.ok(page >= 1 && page <= 2, 'the repeated second page must stop pagination');
		return Response.json({ data: [{ id: 'repeated-team' }] });
	});
	await assert.rejects(
		new WirespeedApi('test-api-key').searchAllTeams({}),
		/pagination did not advance/
	);
	assert.deepEqual(requestedPages, [1, 2]);
});

test('overlapping pages retain each record once and continue to later records', async (t) => {
	const first = { id: 'first', title: 'First case' };
	const second = { id: 'second', title: 'Second case' };
	const third = { id: 'third', title: 'Third case' };
	const pages = [[first, second], [second, third], []];
	const requestedPages: number[] = [];
	t.mock.method(globalThis, 'fetch', async (_input: unknown, init?: RequestInit) => {
		const { page } = JSON.parse(String(init?.body));
		requestedPages.push(page);
		assert.ok(page >= 1 && page <= pages.length, 'pagination must stop at the empty page');
		return Response.json({ data: pages[page - 1] });
	});
	const result = await new WirespeedApi('test-api-key').getAllCases({});
	assert.deepEqual(result.data, [first, second, third]);
	assert.deepEqual(requestedPages, [1, 2, 3]);
});

test('OS statistics combine platform categories and retain uncategorized endpoints in Other', async (t) => {
	const countByCategories = new Map([
		['', 30],
		['Windows,Windows Server', 10],
		['macOS', 6],
		['Linux', 4],
		['Android,iOS', 3]
	]);
	const requestedCategories: string[] = [];
	t.mock.method(globalThis, 'fetch', async (input: unknown, init?: RequestInit) => {
		assert.equal(String(input), 'https://api.wirespeed.co/v1/endpoint/count');
		assert.equal(init?.method, 'POST');
		const query = JSON.parse(String(init?.body));
		const categories = (query.operatingSystemCategories ?? []).slice().sort().join(',');
		assert.ok(countByCategories.has(categories), `Unexpected OS filter: ${categories}`);
		requestedCategories.push(categories);
		return Response.json({ totalCount: countByCategories.get(categories) });
	});
	const result = await new WirespeedApi('test-api-key').getTeamStatisticsOperatingSystems();
	assert.deepEqual(
		Object.fromEntries(
			result.operatingSystems.map(({ operatingSystem, count }) => [
				operatingSystem.toLowerCase(),
				count
			])
		),
		{ windows: 10, macos: 6, linux: 4, mobile: 3, other: 7 }
	);
	assert.deepEqual(requestedCategories.sort(), [...countByCategories.keys()].sort());
});

test('pagination rejects upstream failures rather than returning an incomplete report dataset', async (t) => {
	t.mock.method(globalThis, 'fetch', async (_input: unknown, init?: RequestInit) => {
		const { page } = JSON.parse(String(init?.body));
		return page === 1
			? Response.json({ data: [{ id: 'first' }] })
			: Response.json({ message: 'Search temporarily unavailable' }, { status: 503 });
	});
	await assert.rejects(new WirespeedApi('test-api-key').getAllCases({}), (error: Error) => {
		assert.match(error.message, /Search temporarily unavailable/);
		assert.match(error.message, /503/);
		return true;
	});
});

test('non-JSON API failures retain their HTTP status and message', async (t) => {
	t.mock.method(
		globalThis,
		'fetch',
		async () => new Response('Upstream unavailable', { status: 502, statusText: 'Bad Gateway' })
	);
	await assert.rejects(new WirespeedApi('test-api-key').getCurrentTeam(), (error: Error) => {
		assert.match(error.message, /502/);
		assert.match(error.message, /Bad Gateway/);
		return true;
	});
});
