# Search API — Response Types & Required Backend Data

## Overview

The search API returns `{ answer, alternatives }`. The `answer.responseType` determines which UI component renders the result. Each response type requires specific data fields from the backend beyond just `answer.text`.

Currently, all specialized data is **hardcoded** in the frontend. This document specifies what the backend needs to return for each `responseType`.

---

## Common Response Structure

```json
{
  "answer": {
    "text": "string — synthesized answer text",
    "responseType": "KNOWLEDGE | CAUSAL | PROCEDURAL | COMPARATIVE | IMPACT | REASONING | null",
    "sources": [{ "entityType": "MEMORY", "entityId": "uuid", "title": "string", "snippet": "string" }],
    "data": { /* response-type-specific data — see below */ }
  },
  "alternatives": [
    { "entityType": "MEMORY", "entityId": "uuid", "title": "string", "snippet": "string" }
  ]
}
```

> When `responseType` is `null` or unrecognized, the default `PrimaryAnswer` component renders using only `text` and `sources`.

---

## 1. KNOWLEDGE

**UI:** Synthesized answer with sources + follow-up suggestions

```json
{
  "responseType": "KNOWLEDGE",
  "text": "Logseq is an open-source alternative to Obsidian...",
  "sources": [
    { "entityType": "MEMORY", "entityId": "...", "title": "Tool Comparison", "snippet": "..." }
  ],
  "data": {
    "suggestions": [
      "How does this impact performance?",
      "View related audit history",
      "Who owns this area?"
    ]
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `data.suggestions` | `string[]` | Follow-up question suggestions (currently 3 hardcoded) |

---

## 2. CAUSAL

**UI:** Causal chain map → Conflicts → Decision memory → Stats

```json
{
  "responseType": "CAUSAL",
  "text": "The auth service migration was driven by latency requirements.",
  "sources": [...],
  "data": {
    "causalStages": [
      {
        "label": "Requirements",
        "title": "Low-Latency Graph Traversal",
        "description": "System must handle >10k concurrent node queries with sub-50ms response time.",
        "sourceTag": "PRD",
        "sourceLabel": "Source: Q3 Roadmap"
      },
      {
        "label": "Architectural Decisions",
        "title": "Shift to In-Memory Vector Store",
        "description": "Decision made to bypass traditional RDBMS...",
        "sourceTag": "ADR",
        "sourceLabel": "Owner: Archi-Committee"
      },
      {
        "label": "Implementation",
        "title": "RedisGraph + Pinecone Hybrid",
        "description": "Live deployment of dual-engine approach. Verified 38ms average traversal speed.",
        "sourceTag": "GIT",
        "sourceLabel": "Hash: 8f2d9c1"
      }
    ],
    "conflicts": [
      {
        "type": "active",
        "label": "Security vs. Speed",
        "title": "Row-Level Security Performance Drag",
        "description": "RLS implementation adds 15ms overhead per query...",
        "timeAgo": "2 days ago"
      },
      {
        "type": "resolved",
        "label": "Resolved",
        "title": "API Rate Limit Conflict",
        "description": "Resolved by implementing asynchronous batching...",
        "timeAgo": "1 week ago"
      }
    ],
    "evidence": [
      {
        "source": "#arch-discussions",
        "date": "Mar 12, 14:22",
        "quote": "If we don't switch to a vector-first approach now...",
        "author": "Sarah K. (CTO)",
        "hookLabel": "Decision Hook: V1.2"
      },
      {
        "source": "HK-1092: Engine Pivot",
        "date": "Mar 14, 09:10",
        "quote": "Attached: Performance benchmark reports...",
        "attachment": "ATTACHMENT_12.PDF"
      }
    ],
    "stats": {
      "reasoningDepth": 12,
      "causalConfidence": 94,
      "activeConflicts": 2,
      "knowledgeNodes": 1429
    }
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `data.causalStages[]` | array | Ordered causal chain stages (requirement → decision → implementation) |
| `data.conflicts[]` | array | Active and resolved conflicts/contradictions |
| `data.evidence[]` | array | Linked evidence items (Slack threads, Jira tickets, etc.) |
| `data.stats` | object | Summary statistics (depth, confidence, conflicts count, nodes count) |

---

## 3. PROCEDURAL

**UI:** Step-by-step execution guide → Docs → Source verification → Prerequisites → Troubleshooting

```json
{
  "responseType": "PROCEDURAL",
  "text": "System-generated execution path for optimizing cognitive infrastructure nodes.",
  "sources": [...],
  "data": {
    "estimatedTime": "4 mins",
    "steps": [
      {
        "number": 1,
        "title": "Initialize Node Synthesis",
        "description": "Configure the base cognitive environment...",
        "codeSnippet": "$ knot init --profile=\"high-density\" --force",
        "tags": []
      },
      {
        "number": 2,
        "title": "Calibrate Causality Chains",
        "description": "Map the relationships between isolated claims...",
        "codeSnippet": null,
        "tags": ["Verification: Active", "Auto-fix: Off"]
      }
    ],
    "documentation": [
      { "title": "Procedural Best Practices", "description": "Master the cognitive workflow standards." },
      { "title": "CLI Reference Manual", "description": "Full list of node optimization commands." }
    ],
    "sourceVerification": [
      { "stepLabel": "Step 1 Synthesis", "sourceType": "GITHUB", "title": "knot-core/src/init/synthesis_v4.go", "meta": "Updated 2 days ago by @infra-lead" }
    ],
    "prerequisites": [
      { "label": "V3.4 Engine Installed", "checked": true },
      { "label": "50GB Buffer Memory", "checked": false }
    ],
    "troubleshooting": [
      { "title": "Timeouts at Step 2", "description": "Increase the network threshold using --latency-ignore flag..." }
    ]
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `data.estimatedTime` | `string` | Estimated time to complete |
| `data.steps[]` | array | Ordered execution steps with optional code snippets and tags |
| `data.documentation[]` | array | Related documentation links |
| `data.sourceVerification[]` | array | Source references per step |
| `data.prerequisites[]` | array | Prerequisite checklist items |
| `data.troubleshooting[]` | array | Common issues and solutions |

---

## 4. COMPARATIVE

**UI:** Synthesis recommendation → Trade-off matrix → Evidence matrix → Pros & Cons

```json
{
  "responseType": "COMPARATIVE",
  "text": "Systematic evaluation of document-oriented flexibility against relational integrity.",
  "sources": [...],
  "data": {
    "recommendation": {
      "title": "PostgreSQL (Relational Strategy)",
      "confidence": 94,
      "description": "Given your requirement for Atomic transactions and Multi-node graph traversal...",
      "badges": ["Data Integrity", "Graph Capability"]
    },
    "options": ["MongoDB", "PostgreSQL"],
    "winner": "PostgreSQL",
    "matrix": [
      {
        "attribute": "Schema Flexibility",
        "linkCount": 12,
        "values": [
          { "label": "Dynamic", "description": "Schemaless; ideal for rapid prototyping and polymorphic data." },
          { "label": "Hybrid", "description": "Strict relational schema with powerful JSONB document support." }
        ]
      }
    ],
    "evidence": [
      {
        "category": "Chat Threads",
        "items": [
          { "title": "\"Why we moved to JSONB...\"", "meta": "Architecture Stream • Oct 12" }
        ]
      }
    ],
    "pros": [
      { "option": "PostgreSQL", "title": "Native Graph Capabilities", "description": "Recursive CTEs allow for deep hierarchy traversals..." },
      { "option": "MongoDB", "title": "Deployment Speed", "description": "Skip migrations during MVP phase..." }
    ],
    "cons": [
      { "option": "MongoDB", "title": "Data Fragmentation", "description": "Without schema enforcement, cognitive claims can become inconsistent..." },
      { "option": "PostgreSQL", "title": "Connection Overhead", "description": "Requires sophisticated connection pooling..." }
    ]
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `data.recommendation` | object | Synthesis recommendation with confidence and badges |
| `data.options` | `string[]` | Items being compared |
| `data.winner` | `string` | Recommended option |
| `data.matrix[]` | array | Trade-off comparison rows (attribute + values per option) |
| `data.evidence[]` | array | Evidence categories with source items |
| `data.pros[]` | array | Advantages per option |
| `data.cons[]` | array | Vulnerabilities per option |

---

## 5. IMPACT

**UI:** Risk score → Affected entities → Causality map → Evidence → Contradictions

```json
{
  "responseType": "IMPACT",
  "text": "System-wide causality mapping of structural dependencies.",
  "sources": [...],
  "data": {
    "riskScore": {
      "score": 8.4,
      "maxScore": 10,
      "stabilityChange": -62,
      "description": "High probability of cascading failures in 14 downstream microservices..."
    },
    "affectedEntities": [
      { "icon": "hub", "value": "142", "label": "Affected Nodes" },
      { "icon": "link_off", "value": "38", "label": "Broken Links" },
      { "icon": "warning", "value": "12", "label": "Logic Conflicts" },
      { "icon": "history", "value": "4.2y", "label": "Legacy Debt" }
    ],
    "recommendation": "Implement a 'Shadow Proxy' layer for V1 requests to intercept and redirect to V2-compatible schemas before full sunset.",
    "causalityMap": {
      "entryPoint": { "label": "ENTRY POINT", "title": "API Gateway V1" },
      "dependencies": [
        { "label": "AUTH SERVICE", "title": "Legacy Token Handler" },
        { "label": "DATA ENGINE", "title": "Claim Retrieval Hub" },
        { "label": "SCHEMA GEN", "title": "V1 Map Validator" }
      ],
      "failurePoints": [
        { "label": "BROKEN LINK", "title": "Mobile App v4.2.0", "detail": "Auth payload structure missing" },
        { "label": "CONTRADICTION", "title": "B2B Integration Layer", "detail": "Endpoint 404 vs Required SLA" }
      ],
      "evidenceNodes": [
        { "source": "Jira INF-1022", "detail": "Reports v4.2 crashes on staging cluster." },
        { "source": "Slack #api-ops", "detail": "Ops team flagged SLA risks on 08/14." }
      ]
    },
    "evidence": [
      { "badge": "JIRA", "date": "2 days ago", "title": "INF-1022: Regression in V1 Auth", "description": "Auth payload structure mismatch..." },
      { "badge": "SLACK", "date": "Today, 10:42 AM", "title": "#platform-architecture", "description": "B2B integration layer doesn't have a fallback..." },
      { "badge": "DOCS", "date": "May 2024", "title": "SLA_Platinum_Accounts.pdf", "description": "Explicit guarantee of V1 support through Q1 2025." }
    ],
    "contradictions": [
      {
        "tag": "LOGIC ERROR",
        "title": "Deprecation vs. Enterprise SLA",
        "claim": "We can sunset V1 in Q3 2024 to reduce costs.",
        "contradiction": "Service Level Agreement #4412 guarantees support for Legacy Endpoints until Q1 2025...",
        "impactedOrg": "Customer Success"
      }
    ]
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `data.riskScore` | object | Risk score with stability change and description |
| `data.affectedEntities[]` | array | Impact statistics (nodes, links, conflicts, debt) |
| `data.recommendation` | `string` | Arbiter recommendation text |
| `data.causalityMap` | object | Dependency tree with entry point, dependencies, failures, evidence |
| `data.evidence[]` | array | Impact evidence items from different sources |
| `data.contradictions[]` | array | Structural contradictions with claim vs. reality |

---

## 6. REASONING

**UI:** Reasoning path → Timeline of claims → Relational cluster → Evidence metrics → Sources

```json
{
  "responseType": "REASONING",
  "text": "The migration was triggered by a requirement shift in session persistence.",
  "sources": [...],
  "data": {
    "reasoningSteps": [
      { "stepNumber": "01", "stepLabel": "Stimulus", "title": "Requirement change", "description": "Stakeholders requested real-time global session revocation...", "highlighted": false },
      { "stepNumber": "02", "stepLabel": "Obstacle", "title": "Security conflict", "description": "Existing PostgreSQL encryption at rest introduced a 450ms latency overhead...", "highlighted": false },
      { "stepNumber": "03", "stepLabel": "Resolution", "title": "Migration to Redis", "description": "Implemented Redis as an in-memory session store...", "highlighted": true }
    ],
    "timeline": [
      {
        "date": "Mar 12, 14:02",
        "source": "ARCHITECTURE LOG",
        "badge": "VERIFIED",
        "quote": "Current SQL throughput is hitting bottleneck during peak session validation windows.",
        "tags": ["Node: Latency", "Ref: #SQL-902"]
      }
    ],
    "relationalCluster": {
      "centralNode": "SQL",
      "relatedNodes": ["Latency", "Auth"],
      "targetNode": "Redis"
    },
    "metrics": [
      { "label": "P99 LATENCY (POST-MIGRATION)", "value": "84ms", "percent": 84 },
      { "label": "SYSTEM COMPLEXITY INCREASE", "value": "Low (+12%)", "percent": 12 }
    ],
    "references": [
      "Confluence: RFC-2024-Auth",
      "GitHub: PR #8829 (Migration)"
    ]
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `data.reasoningSteps[]` | array | Ordered reasoning steps (stimulus → obstacle → resolution) |
| `data.timeline[]` | array | Chronological claims with verification status |
| `data.relationalCluster` | object | Graph visualization nodes |
| `data.metrics[]` | array | Evidence metrics with values and percentages |
| `data.references[]` | `string[]` | Source references |

---

## Summary

| responseType | Components Rendered | # Data Fields Required |
|---|---|---|
| `null` (default) | PrimaryAnswer | 2 (text, sources) |
| `KNOWLEDGE` | SynthesizedAnswer + InferredNodes | 3 (text, sources, suggestions) |
| `CAUSAL` | CausalChainMap + ConflictLog + DecisionMemory + FooterStats | 4 sections (stages, conflicts, evidence, stats) |
| `PROCEDURAL` | ExecutionGuide + DocLinks + SourceVerification + Prerequisites + Troubleshooting | 6 sections (time, steps, docs, sources, prereqs, troubleshooting) |
| `COMPARATIVE` | SynthesisRecommendation + TradeoffMatrix + EvidenceMatrix + ProsAndCons | 6 sections (recommendation, options, matrix, evidence, pros, cons) |
| `IMPACT` | RiskScore + AffectedEntities + CausalityMap + Evidence + Contradictions | 6 sections (risk, entities, recommendation, map, evidence, contradictions) |
| `REASONING` | ReasoningPath + Timeline + RelationalCluster + EvidenceMetric + Sources | 5 sections (steps, timeline, cluster, metrics, references) |
