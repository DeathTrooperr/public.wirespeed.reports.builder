import type {
	Case,
	CaseSeverityStat,
	Cases,
	DetectionCategoryClassStat,
	DetectionListItem,
	DetectionsList,
	DetectionWithEntities,
	EndpointSearchDto,
	EndpointSearchCountResponse,
	IntegrationSearch,
	IntegrationSearchDto,
	IntegrationV2,
	SearchCasesDto,
	SearchDetectionsDto,
	SearchTeam,
	PaginationDto,
	Team,
	TeamDetectionStatistics,
	TeamResourceStatistics,
	TeamEventStatistics,
	TeamStatisticsOperatingSystem,
	TimeAverageAndChange,
	ReportPeriodDto
} from '../types/wirespeed.types.js';

/** Public API contract: https://api.wirespeed.co/v1/openapi.json */
export class WirespeedApi {
	private baseUrl = 'https://api.wirespeed.co/v1';
	private apiKey: string;

	constructor(apiKey: string) {
		this.apiKey = apiKey;
	}

	private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
		const response = await fetch(`${this.baseUrl}${path}`, {
			...options,
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
				'Content-Type': 'application/json',
				...options.headers
			}
		});

		if (!response.ok) {
			const error = (await response.json().catch(() => ({}))) as { message?: string };
			throw new Error(
				`Wirespeed API error: ${error.message || response.statusText} (${response.status})`
			);
		}

		return response.json();
	}

	/** v1 pages start at 1 and omit totals. Continue through an empty page, including server-capped pages. */
	private async getAllPages<T extends { id: string }>(
		path: string,
		query: PaginationDto
	): Promise<{ data: T[] }> {
		const data: T[] = [];
		const seen = new Set<string>();
		for (let page = 1; ; page++) {
			const result = await this.request<{ data: T[] }>(path, {
				method: 'POST',
				body: JSON.stringify({ ...query, size: 100, page })
			});
			if (result.data.length === 0) return { data };

			const unseen = result.data.filter((item) => !seen.has(item.id));
			if (unseen.length === 0) {
				throw new Error(`Wirespeed API pagination did not advance for ${path}`);
			}
			for (const item of unseen) {
				seen.add(item.id);
				data.push(item);
			}
		}
	}

	/** Current endpoint inventory; the public API does not expose historical OS statistics. */
	async getTeamStatisticsOperatingSystems(): Promise<{
		operatingSystems: TeamStatisticsOperatingSystem[];
	}> {
		const categories: NonNullable<EndpointSearchDto['operatingSystemCategories']>[] = [
			['Windows', 'Windows Server'],
			['macOS'],
			['Linux'],
			['iOS', 'Android']
		];
		const [total, ...counts] = await Promise.all([
			this.getEndpointCount({}),
			...categories.map((operatingSystemCategories) =>
				this.getEndpointCount({ operatingSystemCategories })
			)
		]);
		const names = ['windows', 'macos', 'linux', 'mobile'];
		return {
			operatingSystems: [
				...counts.map(({ totalCount }, index) => ({
					operatingSystem: names[index],
					count: totalCount
				})),
				{
					operatingSystem: 'other',
					count: Math.max(
						0,
						total.totalCount - counts.reduce((sum, count) => sum + count.totalCount, 0)
					)
				}
			]
		};
	}

	async getEndpointCount(query: EndpointSearchDto): Promise<EndpointSearchCountResponse> {
		return this.request('/endpoint/count', { method: 'POST', body: JSON.stringify(query) });
	}

	async getTeamStatisticsResources(): Promise<TeamResourceStatistics> {
		return this.request('/team/statistics/resources', { method: 'POST' });
	}

	async getTeamStatisticsDetections(period: ReportPeriodDto): Promise<TeamDetectionStatistics> {
		return this.request('/team/statistics/detections', {
			method: 'POST',
			body: JSON.stringify(period)
		});
	}

	async getTeamStatisticsEvents(period: ReportPeriodDto): Promise<TeamEventStatistics> {
		return this.request('/team/statistics/events', {
			method: 'POST',
			body: JSON.stringify(period)
		});
	}

	async getCasesStatsBySeverity(query: SearchCasesDto): Promise<CaseSeverityStat[]> {
		return this.request('/cases/stats/severity', { method: 'POST', body: JSON.stringify(query) });
	}

	async getCurrentTeam(): Promise<Team> {
		return this.request('/team', { method: 'GET' });
	}

	async searchTeams(query: PaginationDto): Promise<SearchTeam> {
		return this.request('/team', { method: 'POST', body: JSON.stringify(query) });
	}

	async searchAllTeams(query: PaginationDto): Promise<SearchTeam> {
		return this.getAllPages<Team>('/team', query);
	}

	async switchTeam(teamId: string): Promise<{ accessToken: string }> {
		return this.request('/team/switch', { method: 'POST', body: JSON.stringify({ teamId }) });
	}

	/** Mean time from verdict to remediation. */
	async getMttr(period: ReportPeriodDto): Promise<TimeAverageAndChange> {
		return this.request('/detection/mean-time-to-remediate', {
			method: 'POST',
			body: JSON.stringify(period)
		});
	}

	async getMttd(period: ReportPeriodDto): Promise<TimeAverageAndChange> {
		return this.request('/detection/mean-time-to-detect', {
			method: 'POST',
			body: JSON.stringify(period)
		});
	}

	async getMttv(period: ReportPeriodDto): Promise<TimeAverageAndChange> {
		return this.request('/detection/mean-time-to-verdict', {
			method: 'POST',
			body: JSON.stringify(period)
		});
	}

	/** Mean time from remediation (or verdict) to case closure. */
	async getMttc(period: ReportPeriodDto): Promise<TimeAverageAndChange> {
		return this.request('/detection/mean-time-to-close', {
			method: 'POST',
			body: JSON.stringify(period)
		});
	}

	async getCases(query: SearchCasesDto): Promise<Cases> {
		return this.request('/cases', { method: 'POST', body: JSON.stringify(query) });
	}

	async getAllCases(query: SearchCasesDto): Promise<Cases> {
		return this.getAllPages<Case>('/cases', query);
	}

	async getDetections(query: SearchDetectionsDto): Promise<DetectionsList> {
		return this.request('/detection', { method: 'POST', body: JSON.stringify(query) });
	}

	async getAllDetections(query: SearchDetectionsDto): Promise<DetectionsList> {
		return this.getAllPages<DetectionListItem>('/detection', query);
	}

	/** Detection details include endpoints, directory users, and geographic locations. */
	async getDetection(id: string): Promise<DetectionWithEntities> {
		return this.request(`/detection/${encodeURIComponent(id)}`, { method: 'GET' });
	}

	async getDetectionStatsByCategoryClass(
		query: SearchDetectionsDto
	): Promise<DetectionCategoryClassStat[]> {
		return this.request('/detection/stats/category-class', {
			method: 'POST',
			body: JSON.stringify(query)
		});
	}

	async getIntegrations(query: IntegrationSearchDto): Promise<IntegrationSearch> {
		return this.request('/integration', { method: 'POST', body: JSON.stringify(query) });
	}

	async getAllIntegrations(query: IntegrationSearchDto): Promise<IntegrationSearch> {
		return this.getAllPages<IntegrationV2>('/integration', query);
	}
}
