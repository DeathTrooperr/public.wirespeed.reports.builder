export interface Team {
	id: string;
	name: string;
	enabled: boolean;
	demo: boolean;
	refreshable: boolean;
	testMode: boolean;
	chatOpsWelcomeMessage?: string;
	platformName?: string;
	maxChatOpsPerDay?: number;
	maxAutoContainmentsPerDay?: number;
	chatOpsEscalationDelayMinutes: number;
	monitorHours: number;
	identityAutoContainment: boolean;
	endpointAutoContainment: boolean;
	fileAutoContainment: boolean;
	/** @deprecated escalation emails are now stored in notification_subscription. Use GET /notification/subscription/team-channel?type=NEW_CASE_ESCALATION instead. Removal scheduled for 2026-09-20. */
	escalationEmails: string[];
	escalationSubscriptionEmails: string[];
	logoUrl: string;
	chatOpsSecondFactor: boolean;
	chatOpsAutoExclusion: boolean;
	chatOpsAccountLockedMessage: string;
	createdAt: string;
	/** @deprecated escalation rich-formatting is now stored per recipient in notification_subscription. Removal scheduled for 2026-09-20. */
	richCaseNotifications: boolean;
	/** @deprecated the escalation subject is now stored per recipient in notification_subscription (null → scope-aware per-type default). Removal scheduled for 2026-09-20. */
	escalationSubjectLine?: string;
	emailSignature: string;
	chatOpsSubjectLine: string;
	chatOpsWelcomeMessageInherited?: boolean;
	emailSignatureInherited?: boolean;
	chatOpsSubjectLineInherited?: boolean;
	chatOpsAccountLockedMessageInherited?: boolean;
	domain?: string | null;
	serviceProvider?: boolean;
	parentTeamName?: string;
	parentTeamId?: string;
	parentServiceProvider?: boolean;
	operatingTeam?: boolean;
	useChatOpsOnboardingGroup?: boolean;
	chatOpsAllowBulkSmsInvite?: boolean;
	billableUsers?: number;
	billableEndpoints?: number;
	dataStorageGb?: number | null;
	teamMembers?: number;
	supportEmail?: string;
	address?: string;
	autoSubscribeServiceProviderUsers: boolean;
	sku: 'identity' | 'adr';
	addOns: 'data'[];
	skuStartDate?: string;
	skuEndDate?: string;
	isTrial: boolean;
	skipThirdPartyManagedSourceUpdates: boolean;
	onboardingChecklistCompleted: boolean;
	onboardingChecklistDismissed: boolean;
	askForG2Review: boolean;
	remediationManualUiEnabled: boolean;
}

export interface PaginationDto {
	size?: number;
	page?: number;
	filter?: string;
	search?: string;
	orderBy?: string;
	orderDir?: 'asc' | 'desc';
}

export interface SearchTeam {
	data: Team[];
}

export interface ReportPeriodDto {
	days?: number;
	startDate?: string;
	endDate?: string;
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
	description?: string;
	defaultValue?: string | number | boolean;
	validationPattern?: string;
	validationMinLength?: number;
	validationMaxLength?: number;
	source?: string;
	advancedOption?: boolean;
	hidden?: boolean;
	nonEditable?: boolean;
	entitlementSlug?: string;
	authMethod?: string;
	multiline?: boolean;
	renderAs?: 'switch-card';
}

export type UseCase =
	| 'chat_ops'
	| 'CHECK_ATTACK_SIMULATION'
	| 'CHECK_BREACH'
	| 'CHECK_PLANNED_CHANGE'
	| 'contain_endpoint_isolate'
	| 'contain_endpoint_lock'
	| 'contain_user_disable'
	| 'contain_user_reset_password'
	| 'contain_user_revoke_sessions'
	| 'contain_file_delete'
	| 'contain_file_quarantine'
	| 'CREATE_TICKET'
	| 'ENRICH_FILE'
	| 'ENRICH_IP'
	| 'enrich_detection'
	| 'ON_CONNECT'
	| 'ON_ENABLE'
	| 'ON_DISABLE'
	| 'get_detections'
	| 'get_endpoint'
	| 'get_endpoints'
	| 'get_advanced_hunt'
	| 'get_logs'
	| 'get_user'
	| 'get_users'
	| 'get_user_licenses'
	| 'INTERNAL'
	| 'INTERNAL_AUTH_CHECK'
	| 'OTHER'
	| 'LOG_PARSER'
	| 'DETECTION_PARSER'
	| 'SEND_MESSAGE'
	| 'uncontain_endpoint_unisolate'
	| 'uncontain_endpoint_unlock'
	| 'uncontain_file_add_exclusion'
	| 'uncontain_file_unquarantine'
	| 'uncontain_user_enable'
	| 'update_detection_source'
	| 'UPDATE_TICKET'
	| 'webhook'
	| 'refresh_detection'
	| 'get_rules';

export type IntegrationPlatform =
	| 'acronis'
	| 'admin-by-request'
	| 'agger-labs'
	| 'anthropic'
	| 'aws'
	| 'axonius'
	| 'bitwarden'
	| 'box'
	| 'checkpoint-firewall'
	| 'checkpoint-harmony'
	| 'cisco-catalyst'
	| 'cisco-duo'
	| 'cisco-meraki'
	| 'cisco-secure-access'
	| 'cisco-umbrella'
	| 'connectwise-psa'
	| 'crowdstrike-falcon'
	| 'cyberark'
	| 'darktrace'
	| 'dfir-iris'
	| 'email'
	| 'exium'
	| 'fleet-dm'
	| 'fortianalyzer'
	| 'fortinet'
	| 'freshservice'
	| 'generic-json'
	| 'generic-syslog'
	| 'github'
	| 'google-alert-center'
	| 'google-chronicle'
	| 'google-directory'
	| 'google-security-center'
	| 'halcyon'
	| 'halo-itsm'
	| 'have-i-been-pwned'
	| 'horizon3'
	| 'hyas-protect'
	| 'ipinfo'
	| 'jamf-pro'
	| 'jamf-protect'
	| 'jira-cloud'
	| 'jira-data-center'
	| 'jumpcloud'
	| 'kandji'
	| 'manage-engine-ad-audit-plus'
	| 'microsoft'
	| 'microsoft-entra'
	| 'microsoft-teams'
	| 'microsoft-teams-v2'
	| 'mimecast'
	| 'netskope'
	| 'ninjaone'
	| 'odoo-helpdesk'
	| 'okta'
	| 'one-password'
	| 'onelogin'
	| 'openai'
	| 'orca-security'
	| 'pager-duty'
	| 'palo-alto-networks-cortex'
	| 'palo-alto-ngfw'
	| 'perception-point'
	| 'picus'
	| 'ping-one'
	| 'reversing-labs'
	| 'safebreach'
	| 'sandfly'
	| 'sentinel-one'
	| 'service-now'
	| 'slack'
	| 'sms'
	| 'smtp'
	| 'sonic-wall'
	| 'sophos'
	| 'splunk'
	| 'stairwell'
	| 'tenable-nessus'
	| 'thinkst-canary'
	| 'tracebit'
	| 'unifi'
	| 'vectra'
	| 'watchguard-firebox'
	| 'windows-event-logs'
	| 'wirespeed'
	| 'wiz'
	| 'wordfence'
	| 'zabbix'
	| 'zscaler-zpa';

export type DetectionCategory =
	| 'OTHER__DIAGNOSTIC'
	| 'OTHER__INFORMATIONAL_EVENT'
	| 'OTHER__WARNING'
	| 'OTHER__UNKNOWN'
	| 'OTHER__DECEPTION'
	| 'OTHER__DECEPTION__SIMULATION'
	| 'OTHER__CUSTOM_DETECTION'
	| 'CLOUD__INVOCATION'
	| 'CLOUD__DISCOVERY'
	| 'CLOUD__DATA_TRANSFER'
	| 'CLOUD__PERSISTENCE'
	| 'CLOUD__PUBLIC_BUCKET'
	| 'ENDPOINT__DISCOVERY'
	| 'ENDPOINT__EXECUTION'
	| 'ENDPOINT__LIVE_OFF_THE_LAND'
	| 'ENDPOINT__NUISANCE'
	| 'ENDPOINT__MALWARE_DISCOVERY'
	| 'ENDPOINT__MALWARE_EXECUTION'
	| 'ENDPOINT__LATE_STAGE'
	| 'ENDPOINT__PERSISTENCE'
	| 'ENDPOINT__REMOTE_MANAGEMENT'
	| 'ENDPOINT__LATERAL_MOVEMENT'
	| 'ENDPOINT__IMPACT'
	| 'ENDPOINT__EVASION'
	| 'ENDPOINT__EXPLOITATION'
	| 'ENDPOINT__SIMULATION'
	| 'ENDPOINT__PLANNED_CHANGE'
	| 'IDENTITY__LOGIN'
	| 'IDENTITY__REJECTED_MFA'
	| 'IDENTITY__DISCOVERY'
	| 'IDENTITY__BRUTE_FORCE'
	| 'IDENTITY__PUBLIC_CREDENTIAL_EXPOSURE'
	| 'IDENTITY__PRIVATE_CREDENTIAL_EXPOSURE'
	| 'IDENTITY__PERSISTENCE'
	| 'IDENTITY__ACCOUNT_COMPROMISE'
	| 'IDENTITY__OAUTH_GRANT'
	| 'IDENTITY__SIMULATION'
	| 'NETWORK__INBOUND_CONNECTION'
	| 'NETWORK__OUTBOUND_CONNECTION'
	| 'NETWORK__PHISHING'
	| 'NETWORK__NOISY'
	| 'NETWORK__DISCOVERY'
	| 'EMAIL__PHISHING'
	| 'EMAIL__PHISHING_REPORTED'
	| 'EMAIL__EVASION'
	| 'EMAIL__MALWARE'
	| 'EMAIL__MALICIOUS_LINK'
	| 'EMAIL__GRAYMAIL'
	| 'EMAIL__SPAM'
	| 'EMAIL__BUSINESS_EMAIL_COMPROMISE'
	| 'EMAIL__MAILBOX_RULE'
	| 'DATA__DATA_TRANSFER'
	| 'DATA__DATA_SHARE'
	| 'POSTURE__POSTURE'
	| 'POSTURE__HEALTH';

export interface IntegrationActionV2 {
	slug: string;
	display: string;
	description: string;
	useCases: UseCase[];
	showWebhookSecret?: boolean;
	containmentRequirements?: Record<string, unknown>;
}

export interface IntegrationMetadataConfigV2 {
	authType: 'oauth2' | 'api_token' | 'basic' | 'custom' | 'none' | 'multi';
	authMethods?: IntegrationMetadataConfigAuthMethodV2[];
	name: string;
	oauthRequiresRedirect?: boolean;
	customFields: IntegrationMetadataConfigCustomFieldV2[];
	requiresConfiguration?: boolean;
	requiresWebhook?: boolean;
	logo: string;
	logoLight?: string;
	logoDark?: string;
	beta: boolean;
	description?: string;
	slug: string;
	internalCreds?: boolean;
	docsUrl?: string;
	statusUrl?: string;
	default: boolean;
	rtfm?: boolean;
	useCases: UseCase[];
	integrationTypes?: (
		| 'collaboration'
		| 'endpoint'
		| 'identity'
		| 'network_vpn'
		| 'cloud'
		| 'siem'
		| 'saas'
		| 'attack_simulation'
		| 'deception'
		| 'enrichment'
		| 'email'
		| 'firewall'
		| 'dns'
		| 'custom'
		| 'ai'
	)[];
	actions?: IntegrationActionV2[];
	webhookActions: IntegrationActionV2[];
	containmentActions: IntegrationActionV2[];
	singleInstallOnly?: boolean;
	hideFromCatalog?: boolean;
	comingSoon?: boolean;
	serviceProviderCompatible?: boolean;
	syslogListenerTypes?: ('socket' | 'http' | 'https')[];
	syslogDefaultFraming?: SyslogDefaultFramingV2;
}

export interface IntegrationV2 {
	id: string;
	platform: IntegrationPlatform;
	enabled: boolean;
	teamId: string;
	teamName?: string;
	config: IntegrationMetadataConfigV2;
	permissionsUpdateAvailable: boolean;
	permissionUpdateExplanation: string | null;
	requiresConfiguration?: boolean;
	identityFields: Record<string, unknown>;
	muteHourlyQuality?: Record<string, unknown>;
}

export interface IntegrationSearch {
	data: IntegrationV2[];
}

export interface IntegrationSearchDto {
	size?: number;
	page?: number;
	filter?: string;
	search?: string;
	orderBy?: string;
	orderDir?: 'asc' | 'desc';
	includeDisabled?: boolean;
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
	average: number | null;
	unit: 'seconds' | 'milliseconds';
	change?: number;
}

// Local aggregate used to render reports from the separate statistics endpoints.
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

export interface SearchCasesDto extends PaginationDto, ReportPeriodDto {
	statuses?: (
		| 'NEW'
		| 'PROCESSING'
		| 'ESCALATED'
		| 'HUNTING'
		| 'MONITORING'
		| 'CHATOPS'
		| 'CLOSED'
	)[];
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
	onlyWasMonitored?: boolean;
	onlyChatOps?: boolean;
	integrationPlatform?: IntegrationPlatform;
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
	category?: DetectionCategory;
	createdAt?: DateFilterDto;
	groupIds?: string[];
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
	lastNotifiedClientAt?: string | null;
	status: 'NEW' | 'PROCESSING' | 'ESCALATED' | 'HUNTING' | 'MONITORING' | 'CHATOPS' | 'CLOSED';
	createdAt: string;
	detectionSids: string[];
	testMode: boolean;
	firstDetectionSourceIngestedAt: string;
	firstDetectionSourceDetectedAt: string;
	updatedAt?: string;
	closedAt?: string;
	logs: JSONLog[];
	contained: boolean;
	reingested: boolean;
	verdict: 'MALICIOUS' | 'SUSPICIOUS' | 'BENIGN';
	helpfulnessRating?: 'happy' | 'neutral' | 'unhappy' | null;
	title: string;
	categories?: DetectionCategory[];
	excludeFromMeans: boolean;
	verdictedAt?: string;
	detectionCount?: number;
	firstRun: boolean;
	timeToClose?: number;
	teamName?: string;
	containsVIP: boolean;
	containsHVA: boolean;
	containsMobile: boolean;
	externalTicketId?: string;
	externalTicketIntegrationId?: string;
	autoContained?: boolean;
	severity: string;
	severityOrdinal: number;
	respondedAt?: string;
	platforms?: string[];
	notes?: string;
	clientNotified?: boolean;
	summary?: string;
	hasPassedAql?: boolean;
	groups?: string | null;
	groupSummaries?: GroupSummary[];
}

export interface Cases {
	data: Case[];
}

export interface Endpoint {
	id: string;
	displayName: string;
	teamId: string;
	edrSourceId?: string;
	mdmSourceId?: string;
	name?: string;
	hva: boolean;
	hvaOverriddenByUser?: boolean;
	createdAt: string;
	privateIpAddress?: string;
	live?: boolean;
	operatingSystem?: string;
	operatingSystemCategory?:
		| 'Windows'
		| 'Windows Server'
		| 'macOS'
		| 'Linux'
		| 'iOS'
		| 'Android'
		| 'ChromeOS'
		| 'Network Device'
		| 'Other';
	integrationId: string | null;
	canonicalId?: string | null;
	canonicalClusterMemberCount?: number | null;
	canonicalClusterMembers?: CanonicalAssetClusterMemberDto[] | null;
	contained: boolean;
	managed?: boolean;
	publicIpAddress?: string;
	workstation: boolean;
	server: boolean;
	mobile: boolean;
	domainController: boolean;
	lastSeenAt?: string;
	updatedAt?: string;
	raw?: Record<string, unknown>;
	groups: EndpointGroupDTO[];
	groupContainmentEnabled: boolean;
	groupChatOpsEnabled: boolean;
	groupSourceSystemUpdates: boolean;
	groupsSynced: boolean;
	lockPin?: string | null;
}

export interface DirectoryUser {
	id: string;
	displayName: string;
	teamId: string;
	enabled?: boolean;
	directoryId?: string;
	name?: string;
	phoneNumber?: string;
	previousPhoneNumber?: string;
	title?: string;
	email?: string;
	additionalEmails: string[];
	allEmails: string[];
	vip?: boolean;
	nhi?: boolean;
	financial?: boolean;
	technical?: boolean;
	external?: boolean;
	managerDirectoryId?: string;
	managerEmail?: string;
	domain?: string;
	department?: string;
	createdAt: string;
	integrationId: string | null;
	canonicalId?: string | null;
	canonicalClusterMemberCount?: number | null;
	canonicalClusterMembers?: CanonicalAssetClusterMemberDto[] | null;
	roles?: string[] | null;
	lastCredentialExposure?: string | null;
	credentialsExposed: boolean;
	numberCredentialExposures: number;
	lastCheckedForCredentialExposures?: string | null;
	needsChatOpsWelcome?: boolean;
	contained?: boolean;
	username?: string;
	/** @deprecated use isUserContainable logic in the containment dialog instead. This is just an alias to user.managed */
	containable: boolean;
	smsConsentReceivedAt?: string | null;
	smsInviteAttempts: number;
	smsInviteLastSentAt?: string;
	smsInviteOptOut?: boolean;
	administrator?: boolean;
	updatedAt?: string;
	passwordLastChangedAt?: string;
	lastSignInAt?: string;
	raw?: Record<string, unknown>;
	groups: DirectoryUserGroupDTO[];
	licenses: DirectoryUserLicense[];
	managed?: boolean;
	chatOpsOnboardingUser?: boolean;
	groupContainmentEnabled: boolean;
	groupChatOpsEnabled: boolean;
	groupSourceSystemUpdates: boolean;
	groupsSynced: boolean;
	verifiedPhoneNumber?: string;
	emailDirection?: 'sender' | 'receiver';
}

export interface Process {
	id: string;
	displayName: string;
	teamId: string;
	command?: string;
	sha256?: string;
	sha1?: string;
	createdAt: string;
}

export interface Domain {
	id: string;
	displayName: string;
	teamId: string;
	name: string;
	createdAt: string;
}

export interface Location {
	id: string;
	displayName: string;
	teamId: string;
	lat?: string;
	lon?: string;
	city?: string;
	state?: string;
	country?: string;
	countryCode?: string;
	continent?: string;
	continentCode?: string;
	createdAt: string;
}

export interface ThreatName {
	name: string;
	engine: string;
	excluded: boolean;
	matchedFileRiskRules?: string[];
}

export interface FileMetadataVersionInfo {
	name: string;
	value: string;
}

export interface FileMetadata {
	threatNames: ThreatName[];
	lastScanTime: object;
	story?: string;
	versionInfo: FileMetadataVersionInfo[];
	proposedFileNames: string[];
}

export interface File {
	id: string;
	displayName: string;
	teamId: string;
	name?: string;
	path?: string;
	sha256?: string;
	sha1?: string;
	toolName?: string;
	createdAt: string;
	updatedAt: string;
	lastEnrichedAt?: object;
	nameWithPath?: string;
	fileRisk:
		| 'BENIGN'
		| 'MALWARE'
		| 'LATE_STAGE'
		| 'NUISANCE'
		| 'LIVE_OFF_THE_LAND'
		| 'REMOTE_MANAGEMENT'
		| 'UNKNOWN';
	metadata?: FileMetadata;
	enrichedViaIntegration: boolean;
}

export interface ASN {
	asn: string;
	name: string;
	domain: string;
	route: string;
	type: string;
}

export interface Company {
	name: string;
	domain: string;
	type: string;
}

export interface IPMetadataPrivacy {
	vpn: boolean;
	proxy: boolean;
	tor: boolean;
	relay: boolean;
	hosting: boolean;
	service: string;
}

export interface Abuse {
	address: string;
	country: string;
	email: string;
	name: string;
	network: string;
	phone: string;
	ofac: boolean;
	adversarial: boolean;
}

export interface IPDomains {
	ip: string;
	total: number;
	domains: string[];
}

export interface IPInfoMetadataImpl {
	ip?: string;
	hostname?: string;
	city?: string;
	region?: string;
	country?: string;
	loc?: string;
	postal?: string;
	timezone?: string;
	org?: string;
	asn: ASN;
	company: Company;
	privacy: IPMetadataPrivacy;
	abuse: Abuse;
	domains: IPDomains;
	ofac: boolean;
	adversarial: boolean;
}

export interface IP {
	ipv4?: string;
	ipv6?: string;
	metadata?: IPInfoMetadataImpl;
	displayName: string;
	id: string;
	teamId: string;
	createdAt: string;
	updatedAt: string;
	locationId?: string;
	metadataLastFetchedAt: string;
}

export interface UserAgent {
	id: string;
	userAgent: string;
	userAgentAlt: string;
	teamId: string;
	createdAt: string;
	displayName: string;
	browserName: string;
	browserVersion: string;
	browserMajorVersion: string;
	cpuArchitecture: string;
	deviceModel: string;
	deviceVendor: string;
	engineName: string;
	engineVersion: string;
	osName: string;
	osVersion: string;
}

export interface Assets {
	endpoints: Endpoint[];
	directory: DirectoryUser[];
	processes: Process[];
	domains: Domain[];
	locations: Location[];
	files: File[];
	ips: IP[];
	userAgents: UserAgent[];
}

export interface DateFilterDto {
	gt?: string;
	gte?: string;
	lt?: string;
	lte?: string;
}

export interface SearchDetectionsDto extends PaginationDto, ReportPeriodDto {
	caseIdOrSid?: string;
	statuses?: (
		| 'NEW'
		| 'PROCESSING'
		| 'ESCALATED'
		| 'HUNTING'
		| 'MONITORING'
		| 'CHATOPS'
		| 'CLOSED'
	)[];
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
	category?: DetectionCategory;
	exclusionId?: string;
	severity?: 'INFORMATIONAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
	integrationPlatform?: IntegrationPlatform;
	createdAt?: DateFilterDto;
	groupIds?: string[];
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
	status: 'NEW' | 'PROCESSING' | 'ESCALATED' | 'HUNTING' | 'MONITORING' | 'CHATOPS' | 'CLOSED';
	createdAt: string;
	containments: (
		| 'USER'
		| 'PROCESS'
		| 'USER_AGENT'
		| 'FILE'
		| 'ENDPOINT'
		| 'LOCATION'
		| 'IP'
		| 'DOMAIN'
	)[];
	testMode: boolean;
	caseId?: string;
	sourceIngestedAt: string;
	sourceDetectedAt: string;
	verdictedAt?: string;
	updatedAt?: string;
	closedAt?: string;
	logs: JSONLog[];
	raw: Record<string, unknown>;
	refreshRaw?: Record<string, unknown>;
	lastRefreshAt?: string;
	verdict: 'MALICIOUS' | 'SUSPICIOUS' | 'BENIGN';
	helpfulnessRating?: 'happy' | 'neutral' | 'unhappy' | null;
	title: string;
	integrationPlatform: IntegrationPlatform;
	integrationId?: string;
	duplicateDetectionId?: string;
	contained: boolean;
	nextSteps?: string;
	reingested: boolean;
	prevented: boolean;
	managedByThirdParty: boolean;
	excludeFromMeans: boolean;
	caseSid?: string;
	sid: string;
	firstRun: boolean;
	containOnChatOpsFailure: boolean;
	wasEscalated: boolean;
	alwaysNotifyApplied: boolean;
	escalatedAt?: string;
	ocsfDetectionFinding: Record<string, unknown>;
	sourceUrl?: string | null;
	actionSlug?: string;
	exclusionId?: string;
	exclusionSid?: string;
	autoClosed?: boolean;
	autoContained?: boolean;
	category: DetectionCategory;
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
	externalCustomDetectionId?: string;
	autoRemediateStartedAt?: string;
	remediatedAt?: string;
}

export type Detections = DetectionsList;

export interface DetectionCategoryClassStat {
	categoryClass: string;
	displayName: string;
	count: number;
	percentage: number;
}

export interface TeamDetectionStatistics {
	totalDetections: number;
	historicDetections: number;
	escalatedDetections: number;
	containmentDetections: number;
	chatOpsDetections: number;
	automaticallyClosed: number;
	potentialChatOpsDetections: number;
	potentialContainmentDetections: number;
	potentialEscalatedDetections: number;
	verdictedMalicious: number;
	confirmedMalicious: number;
	truePositiveDetections: number;
	falsePositiveDetections: number;
}

export interface TeamResourceStatistics {
	billableUsers: number;
	billableEndpoints: number;
	billableUsersSource: 'license' | 'derived';
	billableEndpointsSource: 'license' | 'derived';
	totalUserSeats: number | null;
	totalEndpointSeats: number | null;
}

export interface TeamEventStatistics {
	totalEvents: number;
	totalBytes: number;
	allTimeTotalEvents: number;
	allTimeTotalBytes: number;
	ocsfStatistics: TeamOCSFStatistic[];
}

export interface CasesCountResponse {
	totalCount: number;
}

export interface EndpointSearchDto {
	size?: number;
	page?: number;
	filter?:
		| 'name'
		| 'OS'
		| 'ip'
		| 'edr_id'
		| 'mdm_id'
		| 'integration_source_id'
		| 'custom_attribute';
	search?: string;
	orderBy?: string;
	orderDir?: 'asc' | 'desc';
	hvaOnly?: boolean;
	onlyContained?: boolean;
	userId?: string;
	showUnmanagedEndpoints?: boolean;
	operatingSystemCategories?: (
		| 'Windows'
		| 'Windows Server'
		| 'macOS'
		| 'Linux'
		| 'iOS'
		| 'Android'
		| 'ChromeOS'
		| 'Network Device'
		| 'Other'
	)[];
	onlyLive?: boolean;
	integrationIds?: string[];
	groupIds?: string[];
	groupFilterOperator?: 'and' | 'or';
	searchAttributeKey?: string;
	caseSensitive?: boolean;
	dedupeCanonicalRoots?: boolean;
	onlyCanonicalClustersWithDuplicates?: boolean;
	teamId?: string;
	canonicalClusterOfEndpointId?: string;
}

export interface EndpointSearchPage {
	data: EndpointSearch[];
	totalCount: number;
}

export interface EndpointSearchCountResponse {
	totalCount: number;
}

export interface CanonicalAssetClusterMemberDto {
	id: string;
	displayLabel: string;
	integrationId: string | null;
	integrationPlatform?: IntegrationPlatform | null;
	name?: string | null;
	username?: string | null;
	email?: string | null;
	additionalEmails?: string[] | null;
	roles?: string[] | null;
	title?: string | null;
	department?: string | null;
	managed?: boolean | null;
	enabled?: boolean | null;
	createdAt?: string | null;
	updatedAt?: string | null;
	live?: boolean | null;
	operatingSystem?: string | null;
	privateIpAddress?: string | null;
	publicIpAddress?: string | null;
}

export interface EndpointGroupDTO {
	id: string;
	endpointId: string;
	group: string;
	teamId: string;
	enabled: boolean;
	createdAt: string;
	overriddenByUser: boolean;
	overriddenByUserId?: string;
	overriddenByUserIdentifier?: string | null;
	groupId: string;
	groupName?: string;
	groupSlug?: string;
	groupContainmentEnabled?: boolean;
	groupChatOpsEnabled?: boolean;
	groupSourceSystemUpdates?: boolean;
	groupAlwaysNotify?: boolean;
	groupRuleSearch?: string;
	groupRuleSearchField?: string;
	groupRuleSearchType?: 'text' | 'regexp';
}

export interface DirectoryUserGroupDTO {
	id: string;
	directoryUserId: string;
	group: string;
	teamId: string;
	overriddenByUser: boolean;
	overriddenByUserId: string | null;
	overriddenByUserIdentifier: string | null;
	enabled: boolean;
	createdAt: string;
	groupId: string;
	groupName?: string;
	groupSlug?: string;
	groupContainmentEnabled?: boolean;
	groupChatOpsEnabled?: boolean;
	groupSourceSystemUpdates?: boolean;
	groupAlwaysNotify?: boolean;
	groupRuleSearch?: string;
	groupRuleSearchField?: string;
	groupRuleSearchType?: 'text' | 'regexp';
}

export interface DirectoryUserLicense {
	licenseId: string;
	licenseName: string;
	productId: string | null;
	integrationPlatform: IntegrationPlatform;
}

export interface GroupSummary {
	id: string;
	name: string;
	color?:
		| 'gray'
		| 'red'
		| 'orange'
		| 'amber'
		| 'green'
		| 'teal'
		| 'blue'
		| 'indigo'
		| 'purple'
		| 'pink'
		| null;
}

export interface DetectionListItem {
	id: string;
	teamId: string;
	sid: string;
	teamName?: string;
	integrationPlatform: IntegrationPlatform;
	sourceName?: string;
	severityOrdinal: number;
	severity: 'INFORMATIONAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
	category: DetectionCategory;
	status: 'NEW' | 'PROCESSING' | 'ESCALATED' | 'HUNTING' | 'MONITORING' | 'CHATOPS' | 'CLOSED';
	verdict: 'MALICIOUS' | 'SUSPICIOUS' | 'BENIGN';
	sourceDetectedAt: string;
	caseSid?: string;
	containsVIP: boolean;
	containsHVA: boolean;
	exclusionId?: string;
	excluded: boolean;
	createdAt: string;
	testMode: boolean;
	reingested: boolean;
	groupSummaries: GroupSummary[];
}

export interface DetectionsList {
	data: DetectionListItem[];
}

export interface EndpointSearch extends Endpoint {
	integrationPlatform: string;
	teamName?: string | null;
	canonicalClusterSearchMatchMemberId?: string | null;
}

export interface DetectionWithEntities extends Detection {
	endpoints: Endpoint[];
	files: File[];
	processes: Process[];
	locations: Location[];
	directory: DirectoryUser[];
	ips: IP[];
	domains: Domain[];
	fileRisk: File['fileRisk'];
	userAgents?: UserAgent[];
	whatHappened: string;
	groups?: string | null;
	groupNames: string[];
}

export interface IntegrationMetadataConfigAuthMethodV2 {
	id?: string;
	displayName?: string;
	description?: string;
	authType: 'oauth2' | 'api_token' | 'basic' | 'custom' | 'none';
}

export interface SyslogDefaultFramingV2 {
	method: 'octet_counting' | 'character_delimited';
	delimiter?: string;
}
