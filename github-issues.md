# GitHub Issues for Omnilith Core

## Phase 1: Personal Foundation (Weeks 1-4)

### Milestone 1.2: Entity Storage (Days 3-4)

**Title**: Implement Entity Storage with JSONB Snapshots  
**Label**: `milestone-1.2`, `core-foundation`

**Description**:
Build the entity snapshot system that provides current state views from the event log.

**Acceptance Criteria**:
- [ ] Create `entity_state` table with migration
- [ ] Implement `SnapshotStorePort` interface  
- [ ] Create `PgSnapshotStore` with CRUD operations
- [ ] Add basic entity versioning (updated_at, version)
- [ ] Write comprehensive tests for entity CRUD operations
- [ ] Integration test: events → snapshots flow

**Technical Details**:
```sql
CREATE TABLE entity_state (
  namespace TEXT NOT NULL,
  type TEXT NOT NULL, 
  id UUID NOT NULL,
  version INT NOT NULL DEFAULT 1,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(namespace, type, id)
);
```

**Definition of Done**: Can store/retrieve arbitrary JSON entities by type with proper versioning.

---

### Milestone 1.3: Schema Registry (Days 5-7)

**Title**: User-Defined Entity Types with JSON Schema Validation  
**Label**: `milestone-1.3`, `core-foundation`

**Description**:
Enable users to define custom entity types with validation, supporting the personal ontology vision.

**Acceptance Criteria**:
- [ ] Create `schema_registry` table with SemVer versioning
- [ ] Implement `PgSchemaRegistry` with JSON Schema storage
- [ ] Add AJV validation pipeline for entity data
- [ ] Create sample schemas (Note, Project, Person types)
- [ ] Schema versioning with backward compatibility
- [ ] Comprehensive tests for schema validation
- [ ] CLI support for schema management

**Success Criteria**: Can define custom entity types like "Note", "Project", "Person" with full validation.

---

### Milestone 1.4: Command System (Days 8-10)

**Title**: Unified Command Bus with Event Sourcing Pipeline  
**Label**: `milestone-1.4`, `core-foundation`

**Description**:
Build the command system that orchestrates: validate schema → check policies → append event → update snapshot.

**Acceptance Criteria**:
- [ ] Create `CommandBus` service in core package
- [ ] Implement `entities.create` and `entities.update` commands  
- [ ] Full pipeline: validate schema → append event → upsert snapshot
- [ ] Basic error handling and response formatting
- [ ] Command idempotency support
- [ ] Integration tests for complete command flow

**Success Criteria**: Can create/update entities via commands with full event trail and snapshots.

---

### Milestone 1.5: Basic Relations (Days 11-12)

**Title**: Typed Relationships Between Entities  
**Label**: `milestone-1.5`, `core-foundation`

**Description**:
Add support for typed relationships between entities, enabling personal knowledge graphs.

**Acceptance Criteria**:
- [ ] Create `relations` table with proper indexes
- [ ] Implement `PgRelationsRepo` for relation management
- [ ] Add `relations.add` and `relations.remove` commands
- [ ] Support basic relation types (CONTAINS, REFERENCES, TAGGED_WITH)
- [ ] Relation integrity checks and validation
- [ ] Comprehensive tests for relation management

**Success Criteria**: Can link entities with typed relationships (e.g., Project CONTAINS Task).

---

### Milestone 1.6: Simple API (Days 13-14)

**Title**: REST API for Personal Entity Management  
**Label**: `milestone-1.6`, `api`, `nest`

**Description**:
Create a simple Nest.js API that exposes the personal ontology system via REST endpoints.

**Acceptance Criteria**:
- [ ] Create basic Nest.js app in `apps/api`
- [ ] Implement `CommandsController` with core endpoints
- [ ] Add basic single-user auth (JWT-based)
- [ ] Health check endpoints for monitoring
- [ ] Basic error handling middleware
- [ ] Postman collection for API testing

**Success Criteria**: Working REST API for personal entity management with authentication.

---

## Phase 2: Personal Intelligence (Weeks 5-6)

### Milestone 2.1: Basic Projections (Days 15-16)

**Title**: Read Models and Projection Framework  
**Label**: `milestone-2.1`, `projections`

**Description**:
Build the projection system for optimized read models of personal data.

**Acceptance Criteria**:
- [ ] Create projection framework foundation
- [ ] Implement "Personal Catalog" projection (entities by type)
- [ ] Add projection rebuild capability from event log
- [ ] Create `GET /v1/projections/catalog` endpoint
- [ ] Basic projection versioning support
- [ ] Tests for projection system integrity

**Success Criteria**: Can query personal data through optimized read models.

---

### Milestone 2.2: Personal Search (Days 17-18)

**Title**: Full-Text Search Across Personal Entities  
**Label**: `milestone-2.2`, `search`

**Description**:
Add powerful search capabilities across all personal entity data.

**Acceptance Criteria**:
- [ ] Add full-text search to projections using PostgreSQL FTS
- [ ] Implement search projection with proper indexing
- [ ] Create `GET /v1/search` endpoint with filtering
- [ ] Support search by entity type and relations
- [ ] Basic ranking and relevance scoring
- [ ] Comprehensive tests for search functionality

**Success Criteria**: Can search across all personal data effectively with relevance ranking.

---

### Milestone 2.3: Personal Policies (Days 19-20)

**Title**: Privacy Rules and Personal Automation  
**Label**: `milestone-2.3`, `policies`

**Description**:
Simple privacy controls and workflow automation for personal data.

**Acceptance Criteria**:
- [ ] Create basic `policy_store` table
- [ ] Implement simple privacy policies (public/private/specific people)
- [ ] Add policy evaluation to command pipeline
- [ ] Create personal workflow triggers (auto-tag, auto-relate)
- [ ] Policy testing framework with fixtures
- [ ] Integration tests for policy evaluation

**Success Criteria**: Can control data privacy and automate simple personal workflows.

---

### Milestone 2.4: Data Export/Import (Days 21-22)

**Title**: Complete Data Portability and Backup  
**Label**: `milestone-2.4`, `portability`

**Description**:
Ensure users have complete control over their data with full export/import capabilities.

**Acceptance Criteria**:
- [ ] Full event log export in portable JSON format
- [ ] Current state export (entities + relations)
- [ ] Import from common formats (Markdown, JSON, CSV)
- [ ] Schema migration tools for data evolution
- [ ] Complete backup/restore functionality
- [ ] Tests for round-trip data integrity

**Success Criteria**: Complete data portability - users can export everything and recreate their system elsewhere.

---

## Phase 3: The Omnilith Network (Major Milestones)

### Creative Network Foundation

**Title**: Multi-User Namespaces and Creative Collaboration  
**Label**: `omnilith-network`, `major-milestone`

**Description**:
Transform from personal ontology to creative network infrastructure supporting The Omnilith vision.

**Acceptance Criteria**:
- [ ] Namespace system: `person.alice`, `scene.jazz`, `grant.arts`
- [ ] Multi-user authentication and namespace isolation
- [ ] Cross-namespace relations with proper permissions
- [ ] Creative workflow templates (music production, collaboration)
- [ ] Contribution tracking with cryptographic proof
- [ ] Revenue attribution system (documentation, not payment)

**Success Criteria**: Two people can collaborate on creative projects with clear attribution.

---

### Music Production Pipeline

**Title**: End-to-End Music Creation and Attribution  
**Label**: `omnilith-music`, `major-milestone`

**Description**:
The first real-world test of The Omnilith: producing music through the ontology system.

**Acceptance Criteria**:
- [ ] Music EntityTypes: Track, Session, Mix, Master, Release
- [ ] Contribution tracking: who did what, when, for how long
- [ ] Collaborative workflows: demos → feedback → remixes → releases
- [ ] Rights and attribution: clear ownership and revenue splits
- [ ] Integration with actual music production tools
- [ ] Physical release coordination (vinyl, merch)

**Success Criteria**: Complete an album using The Omnilith infrastructure with transparent attribution.

---

### Community Onboarding

**Title**: First Wave Artist Onboarding Infrastructure  
**Label**: `omnilith-community`, `major-milestone`

**Description**:
Scale beyond core team to first community of independent artists.

**Acceptance Criteria**:
- [ ] Artist onboarding flow and documentation
- [ ] Community governance processes
- [ ] Conflict resolution mechanisms
- [ ] Aesthetic diversity support (multiple creative visions)
- [ ] Mentorship and knowledge sharing systems
- [ ] Success metrics and community health monitoring

**Success Criteria**: 10+ independent artists successfully using The Omnilith for creative production.

---

## Technical Infrastructure Milestones

### Advanced Ontology System

**Title**: Self-Describing Ontology with Meta-Schema Support  
**Label**: `meta-ontology`, `advanced`

**Description**:
The system uses itself to define itself - ontology definitions become entities in the system.

**Acceptance Criteria**:
- [ ] EntityTypes defined as entities
- [ ] RelationTypes as entities
- [ ] ProcessDefinitions as governance entities
- [ ] Self-hosting: system configuration through its own API
- [ ] Meta-schema validation and evolution
- [ ] Recursive improvement: ontology improves ontology

---

### Distributed Network

**Title**: Federation and Inter-Omnilith Communication  
**Label**: `federation`, `network-state`

**Description**:
Support multiple Omnilith instances communicating and collaborating.

**Acceptance Criteria**:
- [ ] Cross-instance namespace recognition
- [ ] Inter-Omnilith relation support
- [ ] Distributed collaboration workflows
- [ ] Content addressing and verification
- [ ] Network-wide search and discovery
- [ ] Governance protocol for network standards

---

## Quality and Operations

### Testing Infrastructure

**Title**: Comprehensive Test Suite for Production Readiness  
**Label**: `testing`, `ops`

**Acceptance Criteria**:
- [ ] Unit tests for all core services (>90% coverage)
- [ ] Integration tests for full workflows
- [ ] End-to-end tests for API scenarios
- [ ] Performance benchmarks
- [ ] Load testing for multi-user scenarios
- [ ] Security audit and penetration testing

---

### Monitoring and Observability

**Title**: Production Monitoring for Creative Network  
**Label**: `monitoring`, `ops`

**Acceptance Criteria**:
- [ ] Health check system for all components
- [ ] Creative workflow monitoring (time to completion, bottlenecks)
- [ ] Community health metrics (collaboration frequency, satisfaction)
- [ ] Data integrity monitoring (event chain validation)
- [ ] Performance dashboards
- [ ] Automated alerting for critical issues

---

## Documentation and Community

### Developer Documentation

**Title**: Complete Documentation for Omnilith Developers  
**Label**: `documentation`

**Acceptance Criteria**:
- [ ] Architecture guide and design principles
- [ ] API documentation with examples
- [ ] Ontology design patterns
- [ ] Local development setup guide
- [ ] Contributing guidelines
- [ ] Aesthetic philosophy and cultural context

---

### Artist Documentation

**Title**: Artist Guide to The Omnilith  
**Label**: `documentation`, `community`

**Acceptance Criteria**:
- [ ] "Your First Creative Project" tutorial
- [ ] Collaboration workflow examples
- [ ] Revenue and attribution explanation
- [ ] Rights management guide
- [ ] Community standards and expectations
- [ ] Troubleshooting and support resources

---

## Implementation Notes

### Priority Order

1. **Complete Phase 1** (Personal Foundation) - This validates the technical architecture
2. **Build Phase 2** (Personal Intelligence) - This proves the user experience
3. **Creative Network Foundation** - This enables the first collaborations
4. **Music Production Pipeline** - This validates The Omnilith concept
5. **Community Onboarding** - This proves scalability
6. **Advanced features** - Federation, meta-ontology, etc.

### Technical Debt Management

Each milestone should include:
- [ ] Code review and refactoring
- [ ] Performance optimization
- [ ] Security review
- [ ] Documentation updates
- [ ] Technical debt assessment

### Community Integration

Major milestones should include:
- [ ] Community feedback session
- [ ] User testing with real artists
- [ ] Iteration based on feedback
- [ ] Success story documentation
- [ ] Learnings for next milestone

---

This roadmap balances immediate technical needs (personal ontology foundation) with the broader vision (The Omnilith creative network). Each milestone delivers value while building toward the ultimate goal of infrastructure for creative sovereignty and collective production.