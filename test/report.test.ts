import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

async function moduleUrl(relativePath: string, replacements: Record<string, string> = {}) {
	let source = await readFile(new URL(relativePath, import.meta.url), 'utf8');
	for (const [from, to] of Object.entries(replacements)) source = source.replace(from, to);
	const { outputText } = ts.transpileModule(source, {
		compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext }
	});
	return `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
}

const apiUrl = await moduleUrl('../src/lib/server/wirespeed/api.ts');
const logicUrl = await moduleUrl('../src/lib/server/report/logic.ts', {
	'$lib/server/wirespeed/api.js': apiUrl,
	'sanitize-html': import.meta.resolve('sanitize-html')
});
const { getReportData } = (await import(
	logicUrl
)) as typeof import('../src/lib/server/report/logic.js');
const timeframe = {
	startDate: '2026-08-01T00:00:00.000Z',
	endDate: '2026-08-31T23:59:59.999Z',
	periodLabel: 'August 2026'
};
const createdAt = { gte: timeframe.startDate, lte: timeframe.endDate };

for (const serviceProvider of [false, true]) {
	test(`generates a complete v1 report for a ${serviceProvider ? 'service provider client' : 'standalone team'}`, async (t) => {
		const requests: string[] = [];
		const detailIds: string[] = [];
		const casePages: number[] = [];
		let switched = false;
		t.mock.method(globalThis, 'fetch', async (input: unknown, init?: RequestInit) => {
			const url = new URL(String(input));
			assert.equal(url.origin, 'https://api.wirespeed.co');
			assert.ok(url.pathname.startsWith('/v1/'));
			const route = url.pathname.slice(3);
			requests.push(route);
			const body = init?.body ? JSON.parse(String(init.body)) : undefined;
			if (body?.page !== undefined) {
				assert.ok(Number.isInteger(body.page) && body.page >= 1, 'API pages start at 1');
			}
			assert.equal(
				new Headers(init?.headers).get('Authorization'),
				`Bearer ${switched ? 'client-token' : 'test-key'}`
			);
			if (route === '/team') {
				assert.equal(init?.method, 'GET');
				return Response.json(
					serviceProvider && !switched
						? {
								id: 'provider',
								name: 'Provider',
								logoUrl: 'https://example.com/logo.png',
								supportEmail: 'help@example.com'
							}
						: { id: 'client', name: 'Client Team' }
				);
			}
			if (route === '/team/switch') {
				assert.ok(serviceProvider);
				assert.deepEqual(body, { teamId: 'client' });
				switched = true;
				return Response.json({ accessToken: 'client-token' });
			}
			if (route === '/team/statistics/resources') {
				assert.equal(body, undefined);
				return Response.json({ billableUsers: 12, billableEndpoints: 10 });
			}
			if (route === '/team/statistics/detections' || route === '/team/statistics/events') {
				assert.deepEqual(body, { startDate: timeframe.startDate, endDate: timeframe.endDate });
				return Response.json(
					route.endsWith('/events')
						? {
								totalEvents: 1000,
								totalBytes: 9000,
								allTimeTotalEvents: 999999,
								ocsfStatistics: [
									{
										integration: { config: { name: 'Endpoint Security' } },
										totalEvents: 800,
										totalBytes: 1048576
									}
								]
							}
						: { totalDetections: 4, escalatedDetections: 2, automaticallyClosed: 1 }
				);
			}
			if (route === '/endpoint/count') {
				const category = body.operatingSystemCategories?.[0];
				return Response.json({
					totalCount:
						category === undefined
							? 10
							: ({ Windows: 5, macOS: 2, Linux: 1, iOS: 1 } as Record<string, number>)[category]
				});
			}
			if (route.startsWith('/detection/mean-time-to-')) {
				assert.deepEqual(body, { startDate: timeframe.startDate, endDate: timeframe.endDate });
				const metric = route.split('/').at(-1);
				return Response.json(
					metric === 'mean-time-to-detect'
						? { average: null, unit: 'seconds' }
						: metric === 'mean-time-to-verdict'
							? { average: 1250, unit: 'milliseconds' }
							: metric === 'mean-time-to-remediate'
								? { average: 120, unit: 'seconds' }
								: { average: 3600000, unit: 'milliseconds' }
				);
			}
			if (route === '/cases/stats/severity' || route === '/detection/stats/category-class') {
				assert.deepEqual(body, {
					startDate: timeframe.startDate,
					endDate: timeframe.endDate,
					createdAt
				});
				return Response.json(
					route.startsWith('/cases')
						? [{ severity: 'HIGH', count: 2, totalCount: 50, percentage: 25 }]
						: [
								{
									categoryClass: 'IDENTITY',
									displayName: 'Identity',
									count: 4,
									totalCount: 100,
									percentage: 100
								}
							]
				);
			}
			if (route === '/cases') {
				assert.deepEqual(body.createdAt, createdAt);
				assert.ok(body.page >= 1 && body.page <= 3);
				if (body.category) {
					if (body.category === 'IDENTITY__PUBLIC_CREDENTIAL_EXPOSURE')
						return Response.json({
							data:
								body.page === 1
									? [
											{
												id: 'exposure-0',
												createdAt: '2026-08-15T12:00:00.000Z',
												severity: 'HIGH',
												title: 'Credential exposure'
											}
										]
									: []
						});
					casePages.push(body.page);
					return Response.json({
						data:
							body.page < 3
								? [
										{
											id: `exposure-${body.page - 1}`,
											createdAt: '2026-08-15T12:00:00.000Z',
											severity: body.page === 1 ? 'HIGH' : 'LOW',
											title: 'Credential exposure'
										}
									]
								: []
					});
				}
				assert.equal(body.onlyWasEscalated, true);
				return Response.json({
					data:
						body.page === 1
							? [
									{
										id: 'case-1',
										sid: 'C1',
										title: '<b>Escalated</b><script>unsafe</script>',
										summary: '<p>Investigated</p>',
										severity: 'HIGH',
										status: 'CLOSED',
										createdAt: '2026-08-10T00:00:00.000Z'
									}
								]
							: []
				});
			}
			if (route === '/detection') {
				assert.deepEqual(body.createdAt, createdAt);
				assert.ok(body.page >= 1 && body.page <= 3);
				return Response.json({
					data:
						body.page === 1
							? [{ id: 'one' }]
							: body.page === 2
								? [{ id: 'two' }, { id: 'benign' }, { id: 'not-login' }]
								: []
				});
			}
			if (route.startsWith('/detection/')) {
				assert.equal(init?.method, 'GET');
				const id = route.split('/').at(-1)!;
				detailIds.push(id);
				return Response.json({
					id,
					category: id === 'not-login' ? 'ENDPOINT__DISCOVERY' : 'IDENTITY__LOGIN',
					verdict: id === 'benign' ? 'BENIGN' : id === 'two' ? 'MALICIOUS' : 'SUSPICIOUS',
					endpoints: [{ displayName: 'Laptop' }, { displayName: 'Laptop' }],
					directory: [{ displayName: 'Analyst', directoryId: 'user-1' }],
					locations: [{ country: 'United States' }, { country: 'United States' }]
				});
			}
			if (route === '/integration') {
				assert.equal(body.includeDisabled, true);
				return Response.json({
					data:
						body.page === 1
							? [
									{
										id: 'integration-1',
										platform: 'crowdstrike-falcon',
										enabled: true,
										config: { name: 'Endpoint Security', integrationTypes: ['endpoint'] }
									}
								]
							: []
				});
			}
			assert.fail(`Unexpected API route: ${route}`);
		});

		const report = await getReportData(
			'test-key',
			timeframe,
			serviceProvider ? 'client' : undefined,
			{ primary: '#123456' },
			true
		);
		assert.equal(report.companyName, 'Client Team');
		assert.equal(
			report.funnelData.total,
			1000,
			'use selected-period event totals, not integration sums or all-time totals'
		);
		assert.equal(report.eventsByIntegration[0].countValue, 800);
		assert.equal(report.billableUsers, 12);
		assert.deepEqual(report.integrations[0].types, ['Endpoint']);
		assert.deepEqual(report.endpointsByOS, { windows: 5, macos: 2, linux: 1, mobile: 1, other: 1 });
		assert.deepEqual(report.meanTimeMetrics, {
			mttd: 'N/A',
			mttv: '1.3s',
			mttr: '2.0m',
			mttc: '1.0h'
		});
		assert.deepEqual(report.mostAttackedEndpoints, [{ name: 'Laptop', count: 4 }]);
		assert.deepEqual(report.mostAttackedIdentities, [{ name: 'Analyst', count: 4 }]);
		assert.deepEqual(report.suspiciousLoginLocations, [{ country: 'United States', count: 2 }]);
		assert.deepEqual(detailIds.sort(), ['benign', 'not-login', 'one', 'two']);
		assert.equal(report.casesBySeverity.high, 2);
		assert.equal(report.darkWebReport.totalExposures, 2);
		assert.equal(report.darkWebReport.highRiskExposures, 1);
		assert.deepEqual(casePages, [1, 2, 3]);
		assert.equal(report.escalatedCases[0].title, 'Escalated');
		assert.equal(report.escalatedCases[0].response, 'Investigated');
		if (serviceProvider) {
			assert.equal(report.branding?.logo, 'https://example.com/logo.png');
			assert.equal(report.branding?.spName, 'Provider');
			assert.equal(report.branding?.colors?.primary, '#123456');
			assert.equal(report.branding?.hidePoweredBy, true);
		} else {
			assert.equal(report.branding, undefined);
		}
		assert.equal(requests.includes('/team/platform-logo'), false);
	});
}
