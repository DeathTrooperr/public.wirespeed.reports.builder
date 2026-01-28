export interface Team {
	id: string;
	name: string;
	billableUsers?: number;
	billableEndpoints?: number;
}

export interface TeamStatisticsOperatingSystem {
	operatingSystem: string;
	count: number;
}

export interface TeamStatisticsLocation {
	country: string;
	count: number;
}

export interface IntegrationMetadataConfigCustomFieldV2 {
	slug: string;
	display: string;
	type: string;
	required: boolean;
	description: string;
	validationPattern: string;
	validationMinLength: number;
	validationMaxLength: number;
	source: string;
	advancedOption: boolean;
}

export type UseCase =
	| 'chat_ops'
	| 'CHECK_ATTACK_SIMULATION'
	| 'CHECK_BREACH'
	| 'contain_endpoint'
	| 'contain_user'
	| 'CREATE_TICKET'
	| 'ENRICH_FILE'
	| 'ENRICH_IP'
	| 'ON_ENABLE'
	| 'ON_DISABLE'
	| 'get_detections'
	| 'get_endpoint'
	| 'get_endpoints'
	| 'get_logs'
	| 'get_user'
	| 'get_users'
	| 'INTERNAL'
	| 'INTERNAL_AUTH_CHECK'
	| 'OTHER'
	| 'SEND_MESSAGE'
	| 'uncontain_endpoint'
	| 'uncontain_user'
	| 'update_detection_source'
	| 'UPDATE_TICKET'
	| 'webhook';

export type IntegrationPlatform =
	| 'aws'
	| 'box'
	| 'checkpoint-harmony'
	| 'cisco-catalyst'
	| 'cisco-duo'
	| 'cisco-meraki'
	| 'cisco-umbrella'
	| 'connectwise-psa'
	| 'crowdstrike-falcon'
	| 'email'
	| 'fortianalyzer'
	| 'fortinet'
	| 'generic-json'
	| 'generic-syslog'
	| 'google-alert-center'
	| 'google-directory'
	| 'google-security-center'
	| 'have-i-been-pwned'
	| 'hyas-protect'
	| 'ipinfo'
	| 'jamf-pro'
	| 'jamf-protect'
	| 'jira-cloud'
	| 'jira-data-center'
	| 'kandji'
	| 'manage-engine-ad-audit-plus'
	| 'microsoft'
	| 'microsoft-entra'
	| 'microsoft-teams'
	| 'mimecast'
	| 'okta'
	| 'one-password'
	| 'orca-security'
	| 'reversing-labs'
	| 'safebreach'
	| 'sentinel-one'
	| 'slack'
	| 'sms'
	| 'thinkst-canary'
	| 'vectra'
	| 'windows-event-logs'
	| 'wirespeed'
	| 'wiz'
	| 'wordfence';

export interface IntegrationActionV2 {
	slug: string;
	display: string;
	description: string;
	useCases: UseCase[];
}

export interface IntegrationMetadataConfigV2 {
	authType: 'oauth2' | 'api_token' | 'basic' | 'other';
	name: string;
	customFields: IntegrationMetadataConfigCustomFieldV2[];
	logo: string;
	logoLight: string;
	logoDark: string;
	beta: boolean;
	description: string;
	slug: string;
	internalCreds: boolean;
	docsUrl: string;
	default: boolean;
	rtfm: boolean;
	useCases: UseCase[];
	webhookActions: IntegrationActionV2[];
}

export interface IntegrationV2 {
	id: string;
	platform: IntegrationPlatform;
	enabled: boolean;
	teamId: string;
	config: IntegrationMetadataConfigV2;
	permissionsUpdateAvailable: boolean;
	permissionUpdateExplanation: string;
	identityFields: Record<string, unknown>;
}

export interface TeamOCSFStatistic {
	integration: IntegrationV2;
	totalEvents: number;
	totalBytes: number;
}

export interface CaseSeverityStat {
	severity: 'INFORMATIONAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
	count: number;
	percentage: number;
}

export interface TimeAverageAndChange {
	average: number | string;
	unit: 'seconds' | 'milliseconds';
	change: number;
}

export interface TeamStatistics {
	escalatedDetections: number;
	totalDetections: number;
	chatOpsDetections: number;
	containmentDetections: number;
	potentialChatOpsDetections: number;
	potentialContainmentDetections: number;
	potentialEscalatedDetections: number;
	automaticallyClosed: number;
	confirmedMalicious: number;
	verdictedMalicious: number;
	truePositiveDetections: number;
	historicDetections: number;
	falsePositiveDetections: number;
	billableUsers: number;
	billableEndpoints: number;
	operatingSystems: TeamStatisticsOperatingSystem[];
	detectionLocations: TeamStatisticsLocation[];
	suspiciousLoginLocations: TeamStatisticsLocation[];
	ocsfStatistics: TeamOCSFStatistic[];
}

export interface SearchCasesDto {
	size?: number;
	page?: number;
	filter?: string;
	search?: string;
	orderBy?: string;
	orderDir?: 'asc' | 'desc';
	statuses?: string[];
	verdict?: 'MALICIOUS' | 'SUSPICIOUS' | 'BENIGN';
	assetId?: string;
	severity?: 'INFORMATIONAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
	assetType?:
		| 'USER'
		| 'PROCESS'
		| 'USER_AGENT'
		| 'FILE'
		| 'ENDPOINT'
		| 'LOCATION'
		| 'IP'
		| 'DOMAIN';
	exclusionId?: string;
	onlyWasEscalated?: boolean;
	onlyWasContained?: boolean;
	onlyWasMobile?: boolean;
	onlyChatOps?: boolean;
	integrationPlatform?: string;
	hideDemoClients?: boolean;
	categoryClass?:
		| 'ENDPOINT'
		| 'IDENTITY'
		| 'CLOUD'
		| 'EMAIL'
		| 'NETWORK'
		| 'DATA'
		| 'POSTURE'
		| 'OTHER';
	category?: string;
	createdAt?: {
		gt?: string;
		gte?: string;
		lt?: string;
		lte?: string;
	};
}

export interface JSONLog {
	log: string;
	timestamp: string;
	debug: boolean;
}

export interface Case {
	id: string;
	sid: string;
	teamId: string;
	name?: string;
	lastNotifiedClientAt: object;
	status: 'NEW' | 'PROCESSING' | 'ESCALATED' | 'HUNTING' | 'MONITORING' | 'CHATOPS' | 'CLOSED';
	createdAt: string;
	detectionSids?: string[];
	testMode: boolean;
	firstDetectionSourceIngestedAt: string;
	firstDetectionSourceDetectedAt: string;
	updatedAt?: string;
	closedAt?: string;
	logs: JSONLog[];
	contained: boolean;
	reingested: boolean;
	verdict: 'MALICIOUS' | 'SUSPICIOUS' | 'BENIGN';
	title: string;
	categories: string[];
	excludeFromMeans: boolean;
	verdictedAt?: string;
	detectionCount?: number;
	firstRun: boolean;
	mttr?: number;
	teamName?: string;
	containsVIP: boolean;
	containsHVA: boolean;
	containsMobile: boolean;
	externalTicketId?: string;
	externalTicketIntegrationId?: string;
	autoContained: boolean;
	severity: 'INFORMATIONAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
	severityOrdinal: number;
	respondedAt?: string;
	platforms?: string[];
	notes?: string;
	clientNotified: boolean;
	summary?: string;
	hasPassedAql?: boolean;
}

export interface Cases {
	data: Case[];
	totalCount: number;
}

export interface DateFilterDto {
	gt?: string;
	gte?: string;
	lt?: string;
	lte?: string;
}

export interface SearchDetectionsDto {
	size?: number;
	page?: number;
	filter?: string;
	search?: string;
	orderBy?: string;
	orderDir?: 'asc' | 'desc';
	caseIdOrSid?: string;
	statuses?: string[];
	verdict?: 'MALICIOUS' | 'SUSPICIOUS' | 'BENIGN';
	assetId?: string;
	assetType?:
		| 'USER'
		| 'PROCESS'
		| 'USER_AGENT'
		| 'FILE'
		| 'ENDPOINT'
		| 'LOCATION'
		| 'IP'
		| 'DOMAIN';
	hideExcluded?: boolean;
	onlyChatOps?: boolean;
	onlyWasEscalated?: boolean;
	onlyWasContained?: boolean;
	hideDemoClients?: boolean;
	categoryClass?:
		| 'ENDPOINT'
		| 'IDENTITY'
		| 'CLOUD'
		| 'EMAIL'
		| 'NETWORK'
		| 'DATA'
		| 'POSTURE'
		| 'OTHER';
	category?: string;
	exclusionId?: string;
	severity?: 'INFORMATIONAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
	integrationPlatform?: string;
	createdAt?: DateFilterDto;
}

export interface VerdictRule {
	id: string;
	stage: 'TRIAGE' | 'HUNT' | 'MONITOR';
	default: boolean;
	managedByWspd: boolean;
	category: string;
	wspdRule: string;
	retired: boolean;
	escalate: boolean;
	chatOps: boolean;
	close: boolean;
	disabled: boolean;
	containUser: boolean;
	containEndpoint: boolean;
	chatOpsMFA: boolean;
	monitor: boolean;
	monitorFallbackPreset?: 'ESCALATE' | 'ESCALATE_CONTAIN' | 'CLOSE';
	managerChatOps: boolean;
	vipChatOps: boolean;
	createdAt: string;
	updatedAt: string;
	teamId: string;
	chatOpsTimeoutVerdict?: 'MALICIOUS' | 'SUSPICIOUS' | 'BENIGN';
	chatOpsTimeoutMonitor?: boolean;
	chatOpsUnsureVerdict: 'MALICIOUS' | 'SUSPICIOUS' | 'BENIGN';
	verdict?: 'MALICIOUS' | 'SUSPICIOUS' | 'BENIGN';
	description: string;
	managedByParent?: boolean;
	severity: 'INFORMATIONAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
	useSourceSeverity?: boolean;
}

export interface Detection {
	id: string;
	teamId: string;
	teamName?: string;
	sourceDescription?: string;
	notes?: string;
	sourceName?: string;
	description?: string;
	status: 'NEW' | 'PROCESSING' | 'ESCALATED' | 'HUNTING' | 'MONITORING' | 'CHATOPS' | 'CLOSED';
	createdAt: string;
	containments: string[];
	testMode: boolean;
	caseId?: string;
	sourceIngestedAt: string;
	sourceDetectedAt: string;
	verdictedAt?: string;
	updatedAt?: string;
	closedAt?: string;
	logs: JSONLog[];
	raw: Record<string, any>;
	verdict: 'MALICIOUS' | 'SUSPICIOUS' | 'BENIGN';
	title: string;
	integrationPlatform: string;
	integrationId?: string;
	duplicateDetectionId?: string;
	contained: boolean;
	nextSteps?: string;
	reingested: boolean;
	prevented: boolean;
	excludeFromMeans: boolean;
	caseSid?: string;
	sid: string;
	firstRun: boolean;
	containOnChatOpsFailure: boolean;
	wasEscalated: boolean;
	ocsfDetectionFinding: Record<string, any>;
	actionSlug?: string;
	exclusionId?: string;
	exclusionSid?: string;
	autoClosed?: boolean;
	autoContained?: boolean;
	category: string;
	verdictSetting?: VerdictRule;
	chatOpsTest: boolean;
	severity: 'INFORMATIONAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
	severityOrdinal: number;
	containsVIP: boolean;
	containsHVA: boolean;
	excluded: boolean;
	chatOpsTestEmail?: string;
	chatOpsTestPhoneNumber?: string;
	customDetectionId?: string;
}

export interface Detections {
	data: Detection[];
	totalCount: number;
}

export class WirespeedApi {
	private baseUrl = 'https://api.wirespeed.co';
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

	/**
	 * Get team statistics report
	 */
	async getTeamStatistics(days: number): Promise<TeamStatistics> {
		return this.request<TeamStatistics>('/team/statistics', {
			method: 'POST',
			body: JSON.stringify({ days })
		});
	}

	/**
	 * Get case statistics by severity
	 */
	async getCasesStatsBySeverity(days: number): Promise<CaseSeverityStat[]> {
		return this.request<CaseSeverityStat[]>('/cases/stats/severity', {
			method: 'POST',
			body: JSON.stringify({ days })
		});
	}

	/**
	 * Get current team information
	 */
	async getCurrentTeam(): Promise<Team> {
		return this.request<Team>('/team', {
			method: 'GET'
		});
	}

	/**
	 * Calculate mean time to resolution
	 */
	async getMttr(days: number): Promise<TimeAverageAndChange> {
		return this.request<TimeAverageAndChange>('/cases/mttr', {
			method: 'POST',
			body: JSON.stringify({ days })
		});
	}

	/**
	 * Calculate mean time to detect
	 */
	async getMttd(days: number): Promise<TimeAverageAndChange> {
		return this.request<TimeAverageAndChange>('/detection/mttd', {
			method: 'POST',
			body: JSON.stringify({ days })
		});
	}

	/**
	 * Calculate mean time to verdict
	 */
	async getMttv(days: number): Promise<TimeAverageAndChange> {
		return this.request<TimeAverageAndChange>('/detection/mttv', {
			method: 'POST',
			body: JSON.stringify({ days })
		});
	}

	/**
	 * Search and list cases
	 */
	async getCases(query: SearchCasesDto): Promise<Cases> {
		return this.request<Cases>('/cases', {
			method: 'POST',
			body: JSON.stringify(query)
		});
	}

	/**
	 * Search and list detections
	 */
	async getDetections(query: SearchDetectionsDto): Promise<Detections> {
		return this.request<Detections>('/detection', {
			method: 'POST',
			body: JSON.stringify(query)
		});
	}
}
