export interface CaseSeverity {
    critical: number;
    high: number;
    medium: number;
    low: number;
    informational: number;
}


export interface IntegrationMetric {
    name: string;
    processed: string;
    count: string;
    countValue: number;
}

export interface CountryDetection {
    country: string;
    count: number;
}

export interface EndpointOS {
    os: string;
    count: number;
}

export interface AttackedAsset {
    name: string;
    count: number;
}

export interface EscalatedCase {
    id: string;
    sid: string;
    title: string;
    severity: string;
    status: string;
    createdAt: string;
    response: string;
}

export interface ReportData {
    companyName: string;
    reportPeriod: string;
    executiveSummary: string;
    
    billableUsers: number;
    billableEndpoints: number;
    
    detections: {
        total: number;
        historic: number;
        escalated: number;
        escalatedPercent: string;
        chatOps: number;
        chatOpsPercent: string;
        containment: number;
        containmentPercent: string;
        autoClosed: number;
    };
    
    verdictAccuracy: {
        verdictedMalicious: number;
        confirmedMalicious: number;
        truePositives: number;
        truePositivesPercent: string;
        falsePositives: number;
        falsePositivesPercent: string;
    };
    
    potentialActions: {
        wouldEscalate: number;
        wouldChatOps: number;
        wouldContain: number;
    };
    
    eventsByIntegration: IntegrationMetric[];
    detectionsByCountry: CountryDetection[];
    endpointsByOS: EndpointOS[];
    mostAttackedEndpoints: AttackedAsset[];
    mostAttackedIdentities: AttackedAsset[];
    
    meanTimeMetrics: {
        mttr: string;
        mttd: string;
        mttv: string;
    };

    funnelData: {
        total: number;
        detections: number;
        cases: number;
        responded: number;
    };

    casesBySeverity: CaseSeverity;
    suspiciousLoginLocations: CountryDetection[];
    escalatedCases: EscalatedCase[];
    recommendations: string[];
}
