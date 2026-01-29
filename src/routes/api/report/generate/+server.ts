import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import type { EscalatedCase, ReportData, Severity } from '$lib/scripts/types/report.types.js';
import type {
	Case,
	TeamOCSFStatistic,
	TeamStatisticsLocation,
	TeamStatisticsOperatingSystem
} from '$lib/server/types/wirespeed.types.js';
import { WirespeedApi } from '$lib/server/wirespeed/api.js';
import sanitizeHtml from 'sanitize-html';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = (await request.json()) as {
			apiKey?: string
			timeframe: {
				startDate: string,
				endDate: string,
				periodLabel: string
			}
		};
		const { apiKey, timeframe } = body;
		const { startDate, endDate, periodLabel } = timeframe;

		if (!apiKey) {
			return json({ error: 'API key is required' }, { status: 400 });
		}

		const api = new WirespeedApi(apiKey);
		const start = new Date(startDate);
		const end = new Date(endDate);
		const startDateString = start.toISOString();

		// Calculate days between dates for API calls
		const diffTime = Math.abs(end.getTime() - start.getTime());
		const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

		const [team, stats, severityStats, mttr, mttd, mttv, cases, detections] = await Promise.all([
			api.getCurrentTeam(),
			api.getTeamStatistics(days),
			api.getCasesStatsBySeverity(days),
			api.getMttr(days),
			api.getMttd(days),
			api.getMttv(days),
			api.getCases({
				orderBy: 'createdAt',
				orderDir: 'desc',
				createdAt: {
					gte: startDateString
				}
			}),
			api.getDetections({
				orderBy: 'createdAt',
				orderDir: 'desc',
				createdAt: {
					gte: startDateString
				}
			})
		]);

		const detectionAssets = await Promise.all(detections.data.map((d) => api.getAssetsByDetectionId(d.id)));

		const formatTimeMetric = (metric: { average: number | string; unit: string }) => {
			const avg = typeof metric.average === 'string' ? parseFloat(metric.average) : metric.average;

			if (avg === null || avg === undefined || isNaN(avg)) {
				return `0${metric.unit === 'seconds' ? 's' : 'ms'}`;
			}

			// Convert to milliseconds as base
			const ms = metric.unit === 'seconds' ? avg * 1000 : avg;

			if (ms < 1000) {
				return `${ms.toFixed(2)}ms`;
			} else if (ms < 60000) {
				return `${(ms / 1000).toFixed(2)}s`;
			} else {
				return `${(ms / 60000).toFixed(2)}m`;
			}
		};

		const totalEvents = stats.ocsfStatistics.reduce((acc, curr) => acc + Number(curr.totalEvents), 0);

		const sanitizeText = (text: string) => {
			if (!text) return '';
			return sanitizeHtml(text, {
				allowedTags: [],
				allowedAttributes: {}
			})
				.replace(/\s+/g, ' ') // Normalize whitespace
				.trim();
		};

		const endpointsMap: Record<string, number> = {};
		const identitiesMap: Record<string, number> = {};

		detectionAssets.forEach((assets) => {
			assets.endpoints.forEach((e) => {
				const endpoint = e.displayName || e.name;
				if (endpoint) endpointsMap[endpoint] = (endpointsMap[endpoint] || 0) + 1;
			});
			assets.directory.forEach((u) => {
				const integration = u.integrationId as any;
				const platform = integration?.platform || '';
				const identity = u.displayName || u.email;
				if(identity && u.directoryId) identitiesMap[identity] = (identitiesMap[identity] || 0) + 1;
			});
		});

		const mostAttackedEndpoints = Object.entries(endpointsMap)
			.map(([name, count]) => ({ name, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 5);

		const mostAttackedIdentities = Object.entries(identitiesMap)
			.map(([name, count]) => ({ name, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 5);

		const report: ReportData = {
			companyName: team.name,
			reportPeriodLabel: periodLabel,
			reportPeriod: `Last ${days} Days`,
			executiveSummary:
				`During the time frame of this report, Wirespeed analyzed ${totalEvents.toLocaleString()} events from ${stats.billableEndpoints} ` +
				`endpoints, ${stats.billableUsers} users, and other assets on your network. Of those events, there were ${stats.totalDetections} ` +
				`events triggered detections through automated rules and analysis. Of these detections Wirespeed & integrated security tools automatically` +
				`resolved ${stats.automaticallyClosed} detections and escalated ${stats.escalatedDetections} detections to your security team. ` +
				`Those investigations led to ${Number((stats.chatOpsDetections + stats.containmentDetections))} response actions which were taken to stop further compromise ` +
				'by your security team. This defense strategy continues to reduce your risk, which maximizes your security and minimizes cyberattack damage to your business.',

			billableUsers: stats.billableUsers,
			billableEndpoints: stats.billableEndpoints,

			detections: {
				total: stats.totalDetections,
				historic: stats.historicDetections,
				escalated: stats.escalatedDetections,
				escalatedPercent:
					stats.totalDetections > 0
						? `${((stats.escalatedDetections / stats.totalDetections) * 100).toFixed(2)}%`
						: '0%',
				chatOps: stats.chatOpsDetections,
				chatOpsPercent:
					stats.totalDetections > 0
						? `${((stats.chatOpsDetections / stats.totalDetections) * 100).toFixed(2)}%`
						: '0%',
				containment: stats.containmentDetections,
				containmentPercent:
					stats.totalDetections > 0
						? `${((stats.containmentDetections / stats.totalDetections) * 100).toFixed(2)}%`
						: '0%',
				autoClosed: stats.automaticallyClosed
			},

			verdictAccuracy: {
				verdictedMalicious: stats.verdictedMalicious,
				confirmedMalicious: stats.confirmedMalicious,
				truePositives: stats.truePositiveDetections,
				truePositivesPercent:
					stats.escalatedDetections > 0
						? `${((stats.truePositiveDetections / stats.escalatedDetections) * 100).toFixed(2)}%`
						: '0%',
				falsePositives: stats.falsePositiveDetections,
				falsePositivesPercent:
					stats.escalatedDetections > 0
						? `${((stats.falsePositiveDetections / stats.escalatedDetections) * 100).toFixed(2)}%`
						: '0%'
			},

			potentialActions: {
				wouldEscalate: stats.potentialEscalatedDetections,
				wouldChatOps: stats.potentialChatOpsDetections,
				wouldContain: stats.potentialContainmentDetections
			},

			eventsByIntegration: stats.ocsfStatistics.map((s: TeamOCSFStatistic) => ({
				name: s.integration.config.name,
				processed: `${(s.totalBytes / 1024 / 1024).toFixed(2)} MB`,
				count: s.totalEvents.toLocaleString(),
				countValue: Number(s.totalEvents)
			})),

			detectionsByCountry: stats.detectionLocations.map((l: TeamStatisticsLocation) => ({
				country: l.country,
				count: l.count
			})),

			endpointsByOS: stats.operatingSystems.map((o: TeamStatisticsOperatingSystem) => ({
				os: o.operatingSystem,
				count: o.count
			})),

			mostAttackedEndpoints,
			mostAttackedIdentities,

			meanTimeMetrics: {
				mttr: formatTimeMetric(mttr),
				mttd: formatTimeMetric(mttd),
				mttv: formatTimeMetric(mttv)
			},

			funnelData: {
				total: totalEvents,
				detections: stats.totalDetections,
				cases: stats.escalatedDetections,
				responded: Number(stats.chatOpsDetections + stats.containmentDetections)
			},

			casesBySeverity: {
				critical: severityStats.find((s) => s.severity === 'CRITICAL')?.count ?? 0,
				high: severityStats.find((s) => s.severity === 'HIGH')?.count ?? 0,
				medium: severityStats.find((s) => s.severity === 'MEDIUM')?.count ?? 0,
				low: severityStats.find((s) => s.severity === 'LOW')?.count ?? 0,
				informational: severityStats.find((s) => s.severity === 'INFORMATIONAL')?.count ?? 0
			},

			suspiciousLoginLocations: stats.suspiciousLoginLocations.map((l: TeamStatisticsLocation) => ({
				country: l.country,
				count: l.count
			})),

			escalatedCases: ((): EscalatedCase[] => {
				return cases.data.slice(0, 10).map((c: Case) => ({
					id: c.id,
					sid: c.sid,
					title: sanitizeText(c.title),
					severity: c.severity as Severity,
					status: c.status,
					createdAt: c.createdAt,
					response: sanitizeText(c.summary || c.notes || 'Investigated and triaged by Wirespeed MDR.')
				}));
			})()
		};

		return json(report);
	} catch (error) {
		console.error('Error generating report:', error);
		return json({ error: 'Failed to generate report' }, { status: 500 });
	}
};
