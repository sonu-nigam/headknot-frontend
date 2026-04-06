export interface paths {
    "/workspaces/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get workspace
         * @description Retrieves workspace details by ID
         */
        get: operations["getWorkspace"];
        /**
         * Update workspace
         * @description Updates workspace name and/or description
         */
        put: operations["updateWorkspace"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/settings/workspace/{workspaceId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get workspace settings
         * @description Returns the settings for the specified workspace
         */
        get: operations["getWorkspaceSettings"];
        /**
         * Update workspace settings
         * @description Merges the provided settings into the workspace settings
         */
        put: operations["updateWorkspaceSettings"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/settings/user": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get current user settings
         * @description Returns the current user's settings and preferences
         */
        get: operations["getUserSettings"];
        /**
         * Update user preferences
         * @description Merges the provided preferences into the current user's settings
         */
        put: operations["updateUserPreferences"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/settings/app/{key}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get app config by key
         * @description Returns a single application configuration entry by its key
         */
        get: operations["getAppConfig"];
        /**
         * Set app config
         * @description Creates or updates an application configuration entry
         */
        put: operations["setAppConfig"];
        post?: never;
        /**
         * Delete app config
         * @description Deletes an application configuration entry by its key
         */
        delete: operations["deleteAppConfig"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/profile/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get profile
         * @description Get profile by ID
         */
        get: operations["getProfile"];
        /**
         * Update profile
         * @description Update profile details. Users can only update their own profile.
         */
        put: operations["updateProfile"];
        post?: never;
        /**
         * Delete profile
         * @description Delete a profile. Users can only delete their own profile.
         */
        delete: operations["deleteProfile"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/profile/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get my profile
         * @description Get the profile of the current authenticated user
         */
        get: operations["getMyProfile"];
        /**
         * Update my profile
         * @description Update the profile of the current authenticated user
         */
        put: operations["updateMyProfile"];
        post?: never;
        /**
         * Delete my profile
         * @description Delete the profile of the current authenticated user
         */
        delete: operations["deleteMyProfile"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/preferences": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get notification preferences
         * @description Retrieves the current user's notification preferences
         */
        get: operations["getPreferences"];
        /**
         * Update notification preferences
         * @description Updates the current user's notification preferences
         */
        put: operations["updatePreferences"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/billing/workspace/{workspaceId}/plan": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Change plan
         * @description Changes a workspace's subscription plan
         */
        put: operations["changeWorkspacePlan"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workspaces": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create workspace
         * @description Creates a new workspace owned by the current user
         */
        post: operations["createWorkspace"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workspaces/{id}/members": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add member
         * @description Adds a user as a member to the workspace
         */
        post: operations["addMember"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workspaces/{id}/deactivate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Deactivate workspace
         * @description Deactivates the workspace
         */
        post: operations["deactivateWorkspace"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workspaces/{id}/activate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Activate workspace
         * @description Activates the workspace
         */
        post: operations["activateWorkspace"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search/temporal": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Temporal search
         * @description Search with temporal context — scopes results to a specific point in time.
         */
        post: operations["temporalSearch"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search/reason": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Agent-powered reasoning over the temporal knowledge graph
         * @description Uses an LLM agent with graph traversal tools to plan, gather evidence, and synthesize answers from the temporal knowledge graph.
         */
        post: operations["reason"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/relationships": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Find relationships by claim
         * @description Finds all relationships involving a specific claim (as source or target). Optionally filter by relationship type.
         */
        get: operations["findRelationships"];
        put?: never;
        /**
         * Create relationship
         * @description Creates a new relationship between two claims. Both claims must exist.
         */
        post: operations["createRelationship"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/relationships/{relationshipId}/feedback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get feedback history
         * @description Returns all feedback for a relationship
         */
        get: operations["getFeedbackHistory"];
        put?: never;
        /**
         * Submit feedback
         * @description Submit feedback on a relationship: CONFIRM, REJECT, or RECLASSIFY. Records an audit trail and updates the relationship status.
         */
        post: operations["submitFeedback"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reason": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Retrieve and generate
         * @description Performs vector-based retrieval and generates a response based on the provided message
         */
        post: operations["generate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/profile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create profile
         * @description Create a new profile for the current user
         */
        post: operations["createProfile"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/{id}/read": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark notification as read
         * @description Marks a specific notification as read
         */
        post: operations["markAsRead"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/read-all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark all notifications as read
         * @description Marks all notifications for the current user as read
         */
        post: operations["markAllAsRead"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/knowledge/entities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List entity by workspace
         * @description Returns all entities in a workspace. Optionally filter by entity type.
         */
        get: operations["listEntities"];
        put?: never;
        /**
         * Create or get entity
         * @description Creates a new knowledge entity. If an entity with the same name, type, and workspace already exists, returns the existing one (idempotent).
         */
        post: operations["createEntity"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/knowledge/entities/{entityId}/memories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get memories linked to an entity */
        get: operations["getMemoriesForEntity"];
        put?: never;
        /**
         * Link memory to entity
         * @description Creates an explicit link between a memory and this entity. Idempotent — if the link already exists, returns it.
         */
        post: operations["linkMemory"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/knowledge/entities/{entityId}/aliases": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get aliases for an entity */
        get: operations["getAliases"];
        put?: never;
        /**
         * Add alias to entity
         * @description Adds an alternate name for an entity. Idempotent — if the alias already exists, returns it.
         */
        post: operations["addAlias"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/knowledge/claims": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Query claims
         * @description Returns claims filtered by entity ID, block ID, or snapshot ID. When filtering by snapshot ID, returns all claims associated with the blocks in that snapshot.
         */
        get: operations["queryClaims"];
        put?: never;
        /**
         * Create claim
         * @description Records a claim linked to a knowledge entity and extracted from a memory block.
         */
        post: operations["createClaim"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/{id}/disconnect": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Disconnect integration
         * @description Disconnects an integration from a workspace
         */
        post: operations["disconnectIntegration"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/{id}/connect": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Connect integration
         * @description Connects an integration to a workspace
         */
        post: operations["connectIntegration"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/workspace/{workspaceId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List integrations
         * @description Retrieves integrations for a workspace, optionally filtered by status or type
         */
        get: operations["listIntegrations"];
        put?: never;
        /**
         * Initialize integrations
         * @description Seeds integrations for a workspace and returns the list
         */
        post: operations["initializeIntegrations"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/source-requests": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Submit source request
         * @description Submits a request for a new integration source
         */
        post: operations["createSourceRequest"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/slack/{integrationId}/test": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Test Slack connection
         * @description Tests the Slack connection and updates sync stats with channel count
         */
        post: operations["testConnection"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/oauth/{provider}/initiate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Initiate OAuth connection
         * @description Starts the OAuth flow for connecting an integration provider. Returns an authorization URL the frontend should redirect the user to. The OAuth provider will callback to the backend, which processes the token exchange and redirects the user to the frontend.
         */
        post: operations["initiateOAuth"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/notion/{integrationId}/test": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Test Notion connection
         * @description Tests the Notion connection and updates sync stats
         */
        post: operations["testConnection_1"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/notion/{integrationId}/sync": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Sync all Notion pages
         * @description Fetches all accessible Notion pages, extracts content, and triggers knowledge extraction (entities, claims, and relationships). This is the main entry point for ingesting Notion content.
         */
        post: operations["syncAll"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/notion/{integrationId}/sync/pages/{pageId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Sync a single Notion page
         * @description Fetches a specific Notion page, extracts content, and triggers knowledge extraction for that page.
         */
        post: operations["syncPage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/notion/{integrationId}/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Search Notion
         * @description Searches across all pages and databases the integration has access to
         */
        post: operations["search"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/notion/{integrationId}/databases/{databaseId}/query": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Query Notion database
         * @description Queries a Notion database for its entries
         */
        post: operations["queryDatabase"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/graph/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List event nodes
         * @description Lists event nodes in a workspace
         */
        get: operations["list"];
        put?: never;
        /**
         * Create event node
         * @description Creates an event node and connects it to subject and object entities: (Subject) -[SUBJECT_OF]-> (EventNode) -[OBJECT_OF]-> (Object)
         */
        post: operations["create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/graph/entities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List entity nodes
         * @description Lists entity vertices in a workspace
         */
        get: operations["list_1"];
        put?: never;
        /**
         * Create entity node
         * @description Creates a new entity vertex in the knowledge graph
         */
        post: operations["create_1"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conflicts/{conflictId}/resolve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Resolve conflict
         * @description Resolves a conflict with a resolution type and optional note.
         */
        post: operations["resolve"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conflicts/{conflictId}/acknowledge": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Acknowledge conflict
         * @description Marks a conflict as acknowledged.
         */
        post: operations["acknowledge"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/billing/workspace/{workspaceId}/subscribe": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Subscribe workspace
         * @description Subscribes a workspace to a plan
         */
        post: operations["subscribeWorkspace"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/billing/workspace/{workspaceId}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Cancel subscription
         * @description Cancels a workspace's subscription
         */
        post: operations["cancelSubscription"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/signup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Signup
         * @description Create a user and receive an access token and refresh token
         */
        post: operations["signup"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Refresh token
         * @description Exchange a valid refresh token for a new access token and refresh token
         */
        post: operations["refresh"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/oauth/google": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Google OAuth Login (Legacy)
         * @deprecated
         * @description DEPRECATED: Legacy endpoint without PKCE. Use /google/initiate and /google/callback instead. Authenticate with Google OAuth. Exchange authorization code for access token and user info. The authorization code should be obtained from Google OAuth consent screen.
         */
        post: operations["googleLogin"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/oauth/google/initiate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Initiate Google OAuth Flow (PKCE)
         * @description Initiates the Google OAuth authorization flow with PKCE (Proof Key for Code Exchange). Returns an authorization URL that the client should redirect the user to. The client must store the returned state parameter and send it back in the callback. This is the recommended secure method for OAuth authentication.
         */
        post: operations["initiateGoogleOAuth"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/oauth/google/callback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Handle Google OAuth Callback (PKCE)
         * @description Completes the Google OAuth flow by exchanging the authorization code for tokens. The state parameter must match the one returned from the initiate endpoint. This endpoint verifies the PKCE code_verifier and authenticates the user. Returns user information and a JWT access token.
         */
        post: operations["handleGoogleOAuthCallback"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Logout
         * @description Revoke the current access token and refresh token
         */
        post: operations["logout"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/logout-all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Logout all devices
         * @description Revoke all refresh tokens for the current user, effectively logging out from all devices
         */
        post: operations["logoutAll"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Login
         * @description Authenticate and receive an access token and refresh token
         */
        post: operations["login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/activity/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Read activity
         * @description Fetch an activity by ID
         */
        post: operations["getActivityLog"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workspaces/my-workspaces": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get my workspaces
         * @description Returns all workspaces owned by the current user
         */
        get: operations["getMyWorkspaces"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workspaces/member": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get member workspaces
         * @description Returns workspaces where user is a member
         */
        get: operations["getMemberWorkspaces"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workspaces/active": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get active workspaces
         * @description Returns all active workspaces accessible by the user
         */
        get: operations["getActiveWorkspaces"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/timeline": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get timeline
         * @description Returns ordered temporal events for a specific object.
         */
        get: operations["getTimeline"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/timeline/changes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get changes since
         * @description Returns all temporal events in a workspace since a given timestamp.
         */
        get: operations["getChangesSince"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/settings/app": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List all app configs
         * @description Returns all application configuration entries
         */
        get: operations["getAllAppConfigs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search workspace
         * @description Hybrid search across memories, spaces, and other content using full-text search + vector similarity. Returns an AI-generated primary answer with source attribution, plus alternative results.
         */
        get: operations["search_1"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/relationships/{relationshipId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get relationship
         * @description Retrieves a specific relationship by ID
         */
        get: operations["getRelationship"];
        put?: never;
        post?: never;
        /**
         * Delete relationship
         * @description Deletes an existing relationship
         */
        delete: operations["deleteRelationship"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List notifications
         * @description Retrieves the current user's notifications with pagination
         */
        get: operations["listNotifications"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/unread": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List unread notifications
         * @description Retrieves the current user's unread notifications
         */
        get: operations["listUnreadNotifications"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/unread/count": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get unread count
         * @description Returns the count of unread notifications for the current user
         */
        get: operations["getUnreadCount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/stream": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Subscribe to notification stream
         * @description Opens an SSE connection for real-time notifications
         */
        get: operations["streamNotifications"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/knowledge/temporal/entities/{entityId}/evolution": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get comprehensive entity evolution timeline
         * @description Returns a unified chronological timeline of all events for an entity, including claim creation, invalidation, and expiry events.
         */
        get: operations["getEntityEvolution"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/knowledge/temporal/entities/{entityId}/claims/history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get full temporal evolution of an entity's claims
         * @description Returns the complete temporal history of all claims for an entity, grouped by predicate and sorted chronologically within each group.
         */
        get: operations["getClaimHistory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/knowledge/temporal/entities/{entityId}/claims/at": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get claims valid at a specific point in time
         * @description Returns all claims for the given entity that were valid at the specified timestamp. A claim is valid if its validFrom is before or at the time, and its validTo is after the time or null.
         */
        get: operations["getClaimsValidAt"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/knowledge/temporal/claims/{claimId}/lineage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get invalidation lineage chain for a claim
         * @description Traces the chain of claims that were invalidated by or derived from the specified claim, using a recursive query up to 10 levels deep.
         */
        get: operations["getClaimLineage"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/knowledge/entities/{entityId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get entity by ID */
        get: operations["getEntity"];
        put?: never;
        post?: never;
        /** Delete entity */
        delete: operations["deleteEntity"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/knowledge/entities/by-memory/{memoryId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get entities linked to a memory */
        get: operations["getEntitiesForMemory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/knowledge/claims/{claimId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get claim by ID */
        get: operations["getClaim"];
        put?: never;
        post?: never;
        /** Delete claim */
        delete: operations["deleteClaim"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get integration
         * @description Retrieves details of a specific integration
         */
        get: operations["getIntegration"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/{id}/sync-stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get sync stats
         * @description Retrieves sync statistics for an integration
         */
        get: operations["getSyncStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/source-requests/workspace/{workspaceId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List source requests
         * @description Retrieves source requests for a workspace
         */
        get: operations["listSourceRequests"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/slack/{integrationId}/users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Slack users
         * @description Lists all users in the connected Slack workspace
         */
        get: operations["listUsers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/slack/{integrationId}/team": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get team info
         * @description Gets information about the connected Slack team/workspace
         */
        get: operations["getTeamInfo"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/slack/{integrationId}/channels": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Slack channels
         * @description Lists all channels accessible by the connected Slack user
         */
        get: operations["listChannels"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/slack/{integrationId}/channels/{channelId}/history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get channel history
         * @description Gets message history for a specific Slack channel
         */
        get: operations["getChannelHistory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/oauth/{provider}/callback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Handle OAuth callback
         * @description Handles the OAuth callback from the provider. The OAuth provider redirects the user's browser here after authorization. The backend exchanges the code for tokens, connects the integration, and redirects the user back to the frontend.
         */
        get: operations["handleCallback"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/notion/{integrationId}/users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Notion users
         * @description Lists all users in the connected Notion workspace
         */
        get: operations["listUsers_1"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/notion/{integrationId}/pages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Notion pages
         * @description Lists all pages the integration has access to
         */
        get: operations["listPages"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/notion/{integrationId}/pages/{pageId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Notion page
         * @description Retrieves a specific Notion page by ID
         */
        get: operations["getPage"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/notion/{integrationId}/databases": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Notion databases
         * @description Lists all databases the integration has access to
         */
        get: operations["listDatabases"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/notion/{integrationId}/databases/{databaseId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Notion database
         * @description Retrieves a specific Notion database by ID
         */
        get: operations["getDatabase"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/notion/{integrationId}/blocks/{blockId}/children": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get block children
         * @description Retrieves the content blocks of a page or block
         */
        get: operations["getBlockChildren"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/graph/query/temporal": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Temporal query
         * @description Finds event nodes for an entity within a time range
         */
        get: operations["temporalQuery"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/graph/query/path": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Find paths
         * @description Finds paths between two entities through event nodes
         */
        get: operations["findPaths"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/graph/events/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get event node
         * @description Retrieves an event node with its connected subject and object entities
         */
        get: operations["get"];
        put?: never;
        post?: never;
        /**
         * Delete event node
         * @description Deletes an event node and all connected edges
         */
        delete: operations["delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/graph/entities/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get entity node
         * @description Retrieves an entity vertex by ID
         */
        get: operations["get_1"];
        put?: never;
        post?: never;
        /**
         * Delete entity node
         * @description Deletes an entity vertex and all connected edges
         */
        delete: operations["delete_1"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/graph/entities/{id}/neighbors": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get neighbors
         * @description Retrieves entities connected via event nodes
         */
        get: operations["getNeighbors"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/graph/entities/{id}/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get entity events
         * @description Retrieves all event nodes connected to an entity
         */
        get: operations["getEvents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conflicts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List conflicts
         * @description Returns conflicts for a workspace, optionally filtered by status.
         */
        get: operations["listConflicts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conflicts/{conflictId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get conflict
         * @description Returns a single conflict by ID.
         */
        get: operations["getConflict"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/billing/workspace/{workspaceId}/usage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get usage
         * @description Returns usage records for a workspace
         */
        get: operations["getUsage"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/billing/workspace/{workspaceId}/subscription": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get subscription
         * @description Returns the subscription for a workspace
         */
        get: operations["getWorkspaceSubscription"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/billing/workspace/{workspaceId}/limits": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Check limits
         * @description Checks all limit statuses for a workspace
         */
        get: operations["checkLimits"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/billing/plans": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List plans
         * @description Returns all active subscription plans
         */
        get: operations["getPlans"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/billing/plans/{name}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get plan
         * @description Returns a subscription plan by name
         */
        get: operations["getPlan"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/activity/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List activities
         * @description Returns a page of activities ordered by updatedAt DESC
         */
        get: operations["getActivityLogList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workspaces/{id}/members/{memberId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Remove member
         * @description Removes a member from the workspace
         */
        delete: operations["removeMember"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Delete notification
         * @description Deletes a specific notification
         */
        delete: operations["deleteNotification"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** @description Request to update workspace details */
        UpdateWorkspaceRequest: {
            /**
             * @description New workspace name
             * @example Updated Project Name
             */
            name?: string;
            /**
             * @description New workspace description
             * @example Updated description
             */
            description?: string;
        };
        /** @description List of member user IDs */
        UserId: {
            /** Format: uuid */
            value?: string;
            systemUser?: boolean;
        };
        /** @description Workspace details response */
        WorkspaceResponse: {
            /**
             * Format: uuid
             * @description Workspace ID
             */
            id?: string;
            /** @description Workspace name */
            name?: string;
            /** @description Workspace description */
            description?: string;
            ownerId?: components["schemas"]["UserId"];
            /** @description List of member user IDs */
            members?: components["schemas"]["UserId"][];
            /**
             * Format: date-time
             * @description Creation timestamp
             */
            createdAt?: string;
            /**
             * Format: date-time
             * @description Last update timestamp
             */
            updatedAt?: string;
            /** @description Whether the workspace is active */
            active?: boolean;
        };
        UpdateWorkspaceSettingsRequest: {
            settings: {
                [key: string]: Record<string, never>;
            };
        };
        WorkspaceSettingsResponse: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            workspaceId?: string;
            settings?: {
                [key: string]: Record<string, never>;
            };
            /** Format: date-time */
            updatedAt?: string;
        };
        UpdateUserPreferencesRequest: {
            preferences: {
                [key: string]: Record<string, never>;
            };
        };
        UserSettingsResponse: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            userId?: string;
            preferences?: {
                [key: string]: Record<string, never>;
            };
            /** Format: date-time */
            updatedAt?: string;
        };
        SetAppConfigRequest: {
            value: string;
            description?: string;
        };
        AppConfigResponse: {
            /** Format: uuid */
            id?: string;
            key?: string;
            value?: string;
            description?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        /** @description Profile update data */
        UpdateProfileRequest: {
            firstName?: string;
            lastName?: string;
            email?: string;
            bio?: string;
            avatarUrl?: string;
            phoneNumber?: string;
            location?: string;
        };
        ProfileResponse: {
            /** Format: uuid */
            id?: string;
            username?: string;
            firstName?: string;
            lastName?: string;
            fullName?: string;
            email?: string;
            bio?: string;
            avatarUrl?: string;
            phoneNumber?: string;
            location?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        /** @description Update notification preferences request */
        UpdatePreferencesRequest: {
            /** @description Whether in-app notifications are enabled */
            inAppEnabled?: boolean;
            /** @description Whether email notifications are enabled */
            emailEnabled?: boolean;
            /** @description List of disabled notification types */
            disabledTypes?: string[];
        };
        /** @description Notification preference details response */
        NotificationPreferenceResponse: {
            /**
             * Format: uuid
             * @description Preference ID
             */
            id?: string;
            /**
             * Format: uuid
             * @description User ID
             */
            userId?: string;
            /** @description Whether in-app notifications are enabled */
            inAppEnabled?: boolean;
            /** @description Whether email notifications are enabled */
            emailEnabled?: boolean;
            /** @description List of disabled notification types */
            disabledTypes?: string[];
            /**
             * Format: date-time
             * @description Creation timestamp
             */
            createdAt?: string;
            /**
             * Format: date-time
             * @description Last update timestamp
             */
            updatedAt?: string;
        };
        /** @description Change subscription plan request */
        ChangePlanRequest: {
            /**
             * @description New plan name
             * @example enterprise
             */
            planName: string;
        };
        /** @description Workspace subscription details response */
        SubscriptionResponse: {
            /**
             * Format: uuid
             * @description Subscription ID
             */
            id?: string;
            /**
             * Format: uuid
             * @description Workspace ID
             */
            workspaceId?: string;
            /**
             * Format: uuid
             * @description Plan ID
             */
            planId?: string;
            /** @description Subscription status */
            status?: string;
            /**
             * Format: date-time
             * @description Subscription start timestamp
             */
            startedAt?: string;
            /**
             * Format: date-time
             * @description Subscription expiration timestamp
             */
            expiresAt?: string;
            /**
             * Format: date-time
             * @description Creation timestamp
             */
            createdAt?: string;
            /**
             * Format: date-time
             * @description Last update timestamp
             */
            updatedAt?: string;
        };
        /** @description Request to create a new workspace */
        CreateWorkspaceRequest: {
            /**
             * @description Workspace name
             * @example My Project
             */
            name: string;
            /**
             * @description Workspace description
             * @example A workspace for project collaboration
             */
            description?: string;
        };
        /** @description Request to add a member to a workspace */
        AddWorkspaceMemberRequest: {
            /**
             * Format: uuid
             * @description User ID of the member to add
             */
            memberId: string;
        };
        TemporalSearchRequest: {
            query?: string;
            /** Format: date-time */
            temporalContext?: string;
            /** Format: int32 */
            limit?: number;
            /** Format: int32 */
            offset?: number;
        };
        AnswerResult: {
            text?: string;
            responseType?: string;
            sources?: components["schemas"]["SearchResultItem"][];
            data?: {
                [key: string]: Record<string, never>;
            };
        };
        SearchResponse: {
            answer?: components["schemas"]["AnswerResult"];
            alternatives?: components["schemas"]["SearchResultItem"][];
        };
        SearchResultItem: {
            entityType?: string;
            /** Format: uuid */
            entityId?: string;
            entitySubtype?: string;
            title?: string;
            snippet?: string;
            responseType?: string;
        };
        ReasoningRequest: {
            query?: string;
            /** Format: date-time */
            temporalContext?: string;
            /** Format: int32 */
            maxHops?: number;
            reasoningStyle?: string;
        };
        ReasoningResponse: {
            answer?: string;
            sources?: components["schemas"]["SourceReference"][];
            reasoningTrace?: string[];
            unresolvedConflicts?: components["schemas"]["UnresolvedConflict"][];
        };
        SourceReference: {
            /** Format: uuid */
            claimId?: string;
            claimText?: string;
            sourceApp?: string;
            /** Format: date-time */
            validFrom?: string;
            /** Format: date-time */
            validTo?: string;
        };
        UnresolvedConflict: {
            /** Format: uuid */
            conflictId?: string;
            claim1Text?: string;
            claim2Text?: string;
        };
        /** @description Request to create a new relationship between claims */
        CreateRelationshipRequest: {
            /**
             * Format: uuid
             * @description ID of the source claim
             */
            sourceClaimId: string;
            /**
             * Format: uuid
             * @description ID of the target claim
             */
            targetClaimId: string;
            /**
             * @description Type of relationship
             * @example SUPPORTS
             * @enum {string}
             */
            type: "supports" | "contradicts" | "references" | "derives_from" | "related";
        };
        /** @description Relationship between claims */
        RelationshipResponse: {
            /**
             * Format: uuid
             * @description Relationship ID
             */
            id?: string;
            /**
             * Format: uuid
             * @description Source claim ID
             */
            sourceClaimId?: string;
            /**
             * Format: uuid
             * @description Target claim ID
             */
            targetClaimId?: string;
            /**
             * @description Relationship type
             * @enum {string}
             */
            type?: "supports" | "contradicts" | "references" | "derives_from" | "related";
            /**
             * Format: double
             * @description Confidence score (0.0-1.0)
             */
            confidence?: number;
            /**
             * @description Lifecycle status
             * @enum {string}
             */
            status?: "SUGGESTED" | "CONFIRMED" | "REJECTED";
            /**
             * @description Provenance source
             * @enum {string}
             */
            source?: "SYSTEM" | "USER";
            /**
             * Format: uuid
             * @description Source ID for content provenance
             */
            sourceId?: string;
            /** @description Source application name */
            sourceApp?: string;
            /**
             * Format: date-time
             * @description Creation timestamp
             */
            createdAt?: string;
            /**
             * Format: date-time
             * @description Last update timestamp
             */
            updatedAt?: string;
        };
        /** @description Request to submit feedback on a relationship */
        SubmitFeedbackRequest: {
            /**
             * @description Feedback action
             * @example CONFIRM
             * @enum {string}
             */
            action: "CONFIRM" | "REJECT" | "RECLASSIFY";
            /**
             * @description New type if reclassifying
             * @example SUPPORTS
             */
            newType?: string;
            /** @description Optional comment */
            comment?: string;
        };
        /** @description Feedback record on a relationship */
        FeedbackResponse: {
            /**
             * Format: uuid
             * @description Feedback ID
             */
            id?: string;
            /**
             * Format: uuid
             * @description Relationship ID
             */
            relationshipId?: string;
            /** @description Previous type */
            oldType?: string;
            /** @description New type (if reclassified) */
            newType?: string;
            /** @description Previous status */
            oldStatus?: string;
            /** @description New status */
            newStatus?: string;
            /**
             * Format: uuid
             * @description User who submitted
             */
            userId?: string;
            /** @description Optional comment */
            comment?: string;
            /**
             * Format: date-time
             * @description Timestamp
             */
            createdAt?: string;
        };
        MessageRequest: {
            message?: string;
        };
        /** @description Profile creation data */
        CreateProfileRequest: {
            firstName: string;
            lastName?: string;
            email: string;
        };
        CreateEntityRequest: {
            name: string;
            /** @enum {string} */
            entityType: "person" | "place" | "organization" | "concept" | "technology" | "event" | "other";
            attributes?: {
                [key: string]: Record<string, never>;
            };
            /** Format: uuid */
            workspaceId: string;
        };
        EntityResponse: {
            /** Format: uuid */
            id?: string;
            name?: string;
            /** @enum {string} */
            entityType?: "person" | "place" | "organization" | "concept" | "technology" | "event" | "other";
            attributes?: {
                [key: string]: Record<string, never>;
            };
            aliases?: string[];
            /** Format: uuid */
            workspaceId?: string;
            /** Format: uuid */
            sourceId?: string;
            sourceApp?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        LinkMemoryRequest: {
            /** Format: uuid */
            memoryId: string;
            /** Format: uuid */
            workspaceId: string;
        };
        MemoryEntityLinkResponse: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            memoryId?: string;
            /** Format: uuid */
            entityId?: string;
            /** Format: uuid */
            workspaceId?: string;
            /** Format: date-time */
            createdAt?: string;
        };
        CreateClaimRequest: {
            /** Format: uuid */
            entityId: string;
            /** Format: uuid */
            blockId: string;
            claimText: string;
            predicate?: string;
            /** Format: uuid */
            objectEntityId?: string;
            objectValue?: string;
            polarity?: string;
            /** Format: double */
            confidence?: number;
            /** Format: date-time */
            validFrom?: string;
            /** Format: date-time */
            validTo?: string;
            temporalType?: string;
            statementType?: string;
        };
        ClaimResponse: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            entityId?: string;
            /** Format: uuid */
            blockId?: string;
            claimText?: string;
            predicate?: string;
            /** Format: uuid */
            objectEntityId?: string;
            objectValue?: string;
            polarity?: string;
            /** Format: double */
            confidence?: number;
            metadata?: {
                [key: string]: Record<string, never>;
            };
            /** Format: uuid */
            sourceId?: string;
            sourceApp?: string;
            lifecycleStatus?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            validFrom?: string;
            /** Format: date-time */
            validTo?: string;
            temporalType?: string;
            statementType?: string;
            /** Format: uuid */
            invalidatedBy?: string;
            /** Format: date-time */
            expiredAt?: string;
        };
        /** @description Connect integration request */
        ConnectIntegrationRequest: {
            /**
             * Format: uuid
             * @description Workspace ID
             */
            workspaceId: string;
            /** @description Authentication method (OAUTH2 or API_KEY) */
            authMethod?: string;
            /** @description Connection configuration */
            config?: {
                [key: string]: Record<string, never>;
            };
        };
        /** @description Integration details response */
        IntegrationResponse: {
            /**
             * Format: uuid
             * @description Integration ID
             */
            id?: string;
            /**
             * Format: uuid
             * @description Workspace ID
             */
            workspaceId?: string;
            /** @description Integration type */
            type?: string;
            /** @description Integration status */
            status?: string;
            /** @description Authentication method */
            authMethod?: string;
            /** @description Display name */
            displayName?: string;
            /** @description Description */
            description?: string;
            /** @description Icon URL */
            iconUrl?: string;
            /** @description Connection configuration */
            config?: {
                [key: string]: Record<string, never>;
            };
            /**
             * Format: uuid
             * @description User who connected this integration
             */
            connectedBy?: string;
            /**
             * Format: date-time
             * @description When the integration was connected
             */
            connectedAt?: string;
            /**
             * Format: date-time
             * @description Last sync timestamp
             */
            lastSyncedAt?: string;
            /**
             * Format: int64
             * @description Number of items indexed
             */
            itemsIndexed?: number;
            /** @description Sync status message */
            syncStatusMessage?: string;
            /**
             * Format: date-time
             * @description Creation timestamp
             */
            createdAt?: string;
            /**
             * Format: date-time
             * @description Last update timestamp
             */
            updatedAt?: string;
        };
        /** @description Create source request */
        CreateSourceRequestRequest: {
            /**
             * Format: uuid
             * @description Workspace ID
             */
            workspaceId: string;
            /** @description Name of the requested integration source */
            sourceName: string;
            /** @description Description of why this source is needed */
            description?: string;
        };
        /** @description Source request details response */
        SourceRequestResponse: {
            /**
             * Format: uuid
             * @description Source request ID
             */
            id?: string;
            /**
             * Format: uuid
             * @description Workspace ID
             */
            workspaceId?: string;
            /**
             * Format: uuid
             * @description User who requested
             */
            requestedBy?: string;
            /** @description Name of the requested source */
            sourceName?: string;
            /** @description Description */
            description?: string;
            /** @description Request status */
            status?: string;
            /**
             * Format: date-time
             * @description Creation timestamp
             */
            createdAt?: string;
        };
        /** @description OAuth initiation response */
        OAuthInitiateResponse: {
            /** @description Authorization URL to redirect the user to */
            authorizationUrl?: string;
            /** @description State parameter for CSRF verification */
            state?: string;
        };
        CreateEventNodeRequest: {
            /** Format: uuid */
            subjectId: string;
            /** Format: uuid */
            objectId: string;
            /** @enum {string} */
            eventType: "WORKS_AT" | "FOUNDED" | "ACQUIRED" | "MEMBER_OF" | "LOCATED_IN" | "RELATED_TO" | "CAUSED" | "PARTICIPATED_IN" | "PRODUCED" | "USES" | "CUSTOM";
            description?: string;
            metadata?: {
                [key: string]: Record<string, never>;
            };
            /** Format: double */
            confidence?: number;
            /** Format: date-time */
            validFrom?: string;
            /** Format: date-time */
            validTo?: string;
            /** @enum {string} */
            temporalType: "ATEMPORAL" | "STATIC" | "DYNAMIC";
            /** Format: uuid */
            workspaceId: string;
        };
        EventNodeDetailResponse: {
            /** Format: uuid */
            id?: string;
            eventType?: string;
            description?: string;
            metadata?: {
                [key: string]: Record<string, never>;
            };
            /** Format: double */
            confidence?: number;
            /** Format: date-time */
            validFrom?: string;
            /** Format: date-time */
            validTo?: string;
            temporalType?: string;
            /** Format: uuid */
            workspaceId?: string;
            /** Format: date-time */
            createdAt?: string;
            subject?: components["schemas"]["GraphEntityResponse"];
            object?: components["schemas"]["GraphEntityResponse"];
        };
        GraphEntityResponse: {
            /** Format: uuid */
            id?: string;
            name?: string;
            entityType?: string;
            attributes?: {
                [key: string]: Record<string, never>;
            };
            /** Format: uuid */
            workspaceId?: string;
            /** Format: date-time */
            createdAt?: string;
        };
        CreateGraphEntityRequest: {
            name: string;
            entityType: string;
            attributes?: {
                [key: string]: Record<string, never>;
            };
            /** Format: uuid */
            workspaceId: string;
        };
        ResolveConflictRequest: {
            resolutionType: string;
            resolutionNote?: string;
        };
        ConflictResponse: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            claimAId?: string;
            /** Format: uuid */
            claimBId?: string;
            /** Format: uuid */
            relationshipId?: string;
            /** Format: uuid */
            workspaceId?: string;
            status?: string;
            resolutionType?: string;
            resolutionNote?: string;
            /** Format: uuid */
            resolvedBy?: string;
            /** Format: date-time */
            resolvedAt?: string;
            /** Format: date-time */
            detectedAt?: string;
        };
        /** @description Subscribe workspace to a plan request */
        SubscribeRequest: {
            /**
             * @description Plan name
             * @example pro
             */
            planName: string;
        };
        SignupRequest: {
            username: string;
            fullName: string;
            password: string;
        };
        TokenPairResponse: {
            accessToken?: string;
            /** Format: date-time */
            accessExpiresAt?: string;
            refreshToken?: string;
            /** Format: date-time */
            refreshExpiresAt?: string;
        };
        RefreshRequest: {
            refreshToken: string;
        };
        GoogleOAuthRequest: {
            code: string;
        };
        GoogleOAuthResponse: {
            userId?: string;
            email?: string;
            givenName?: string;
            familyName?: string;
            picture?: string;
            accessToken?: string;
            /** Format: date-time */
            accessExpiresAt?: string;
            refreshToken?: string;
            /** Format: date-time */
            refreshExpiresAt?: string;
        };
        OAuthAuthorizeResponse: {
            authorizationUrl?: string;
            state?: string;
        };
        OAuthCallbackRequest: {
            code: string;
            state: string;
        };
        LogoutRequest: {
            refreshToken: string;
        };
        LoginRequest: {
            username: string;
            password: string;
        };
        ActivityLogResponse: {
            /** Format: uuid */
            id?: string;
            activityType?: string;
            description?: string;
            /** Format: uuid */
            workspaceId?: string;
            /** Format: uuid */
            actorId?: string;
            /** Format: uuid */
            eventId?: string;
            metadata?: {
                [key: string]: Record<string, never>;
            };
            /** Format: date-time */
            occurredAt?: string;
        };
        TemporalEventResponse: {
            /** Format: uuid */
            id?: string;
            objectType?: string;
            /** Format: uuid */
            objectId?: string;
            eventType?: string;
            /** Format: uuid */
            workspaceId?: string;
            /** Format: uuid */
            actorId?: string;
            metadata?: {
                [key: string]: Record<string, never>;
            };
            /** Format: date-time */
            occurredAt?: string;
        };
        /** @description Notification details response */
        NotificationResponse: {
            /**
             * Format: uuid
             * @description Notification ID
             */
            id?: string;
            /**
             * Format: uuid
             * @description User ID
             */
            userId?: string;
            /**
             * Format: uuid
             * @description Workspace ID
             */
            workspaceId?: string;
            /** @description Notification type */
            type?: string;
            /** @description Notification title */
            title?: string;
            /** @description Notification message */
            message?: string;
            /** @description Additional data */
            data?: {
                [key: string]: Record<string, never>;
            };
            /** @description Whether the notification has been read */
            read?: boolean;
            /**
             * Format: date-time
             * @description Timestamp when the notification was read
             */
            readAt?: string;
            /**
             * Format: date-time
             * @description Creation timestamp
             */
            createdAt?: string;
        };
        /** @description Unread notification count response */
        UnreadCountResponse: {
            /**
             * Format: int64
             * @description Number of unread notifications
             */
            count?: number;
        };
        SseEmitter: {
            /** Format: int64 */
            timeout?: number;
        };
        EntityEvolutionResponse: {
            /** Format: uuid */
            entityId?: string;
            entityName?: string;
            entityType?: string;
            events?: components["schemas"]["EvolutionEvent"][];
        };
        EvolutionEvent: {
            /** Format: date-time */
            occurredAt?: string;
            eventType?: string;
            description?: string;
            /** Format: uuid */
            claimId?: string;
            claimText?: string;
            sourceApp?: string;
            metadata?: {
                [key: string]: Record<string, never>;
            };
        };
        PredicateTimeline: {
            predicate?: string;
            entries?: components["schemas"]["TemporalClaimEntry"][];
        };
        TemporalClaimEntry: {
            /** Format: uuid */
            claimId?: string;
            claimText?: string;
            objectValue?: string;
            temporalType?: string;
            statementType?: string;
            /** Format: date-time */
            validFrom?: string;
            /** Format: date-time */
            validTo?: string;
            /** Format: uuid */
            invalidatedBy?: string;
            lifecycleStatus?: string;
            /** Format: uuid */
            sourceId?: string;
            sourceApp?: string;
            /** Format: date-time */
            createdAt?: string;
        };
        TemporalClaimHistoryResponse: {
            /** Format: uuid */
            entityId?: string;
            entityName?: string;
            timelines?: components["schemas"]["PredicateTimeline"][];
        };
        ClaimLineageNode: {
            /** Format: uuid */
            claimId?: string;
            claimText?: string;
            predicate?: string;
            /** Format: date-time */
            validFrom?: string;
            /** Format: date-time */
            validTo?: string;
            /** Format: uuid */
            invalidatedBy?: string;
            lifecycleStatus?: string;
            sourceApp?: string;
            /** Format: int32 */
            depth?: number;
        };
        ClaimLineageResponse: {
            /** Format: uuid */
            rootClaimId?: string;
            chain?: components["schemas"]["ClaimLineageNode"][];
        };
        /** @description Integration sync stats response */
        SyncStatsResponse: {
            /**
             * Format: uuid
             * @description Integration ID
             */
            integrationId?: string;
            /** @description Integration type */
            type?: string;
            /** @description Integration status */
            status?: string;
            /**
             * Format: int64
             * @description Number of items indexed
             */
            itemsIndexed?: number;
            /** @description Sync status message */
            syncStatusMessage?: string;
            /**
             * Format: date-time
             * @description Last sync timestamp
             */
            lastSyncedAt?: string;
        };
        EventNodeResponse: {
            /** Format: uuid */
            id?: string;
            eventType?: string;
            description?: string;
            metadata?: {
                [key: string]: Record<string, never>;
            };
            /** Format: double */
            confidence?: number;
            /** Format: date-time */
            validFrom?: string;
            /** Format: date-time */
            validTo?: string;
            temporalType?: string;
            /** Format: uuid */
            workspaceId?: string;
            /** Format: date-time */
            createdAt?: string;
        };
        GraphPathResponse: {
            entities?: components["schemas"]["GraphEntityResponse"][];
            eventNodes?: components["schemas"]["EventNodeResponse"][];
        };
        /** @description Usage record details response */
        UsageResponse: {
            /**
             * Format: uuid
             * @description Usage record ID
             */
            id?: string;
            /**
             * Format: uuid
             * @description Workspace ID
             */
            workspaceId?: string;
            /** @description Metric name */
            metric?: string;
            /**
             * Format: int64
             * @description Current value
             */
            value?: number;
            /**
             * Format: date-time
             * @description Last recorded timestamp
             */
            recordedAt?: string;
        };
        /** @description Limit check response for a metric */
        LimitCheckResponse: {
            /** @description Metric name */
            metric?: string;
            /**
             * Format: int64
             * @description Current usage value
             */
            current?: number;
            /**
             * Format: int64
             * @description Plan limit (-1 = unlimited)
             */
            limit?: number;
            /** @description Whether usage is within the limit */
            withinLimit?: boolean;
        };
        /** @description Subscription plan details response */
        PlanResponse: {
            /**
             * Format: uuid
             * @description Plan ID
             */
            id?: string;
            /** @description Plan name */
            name?: string;
            /** @description Plan display name */
            displayName?: string;
            /** @description Plan description */
            description?: string;
            /**
             * Format: int32
             * @description Maximum memories allowed (-1 = unlimited)
             */
            maxMemories?: number;
            /**
             * Format: int32
             * @description Maximum entities allowed (-1 = unlimited)
             */
            maxEntities?: number;
            /**
             * Format: int32
             * @description Maximum workspaces allowed (-1 = unlimited)
             */
            maxWorkspaces?: number;
            /**
             * Format: int32
             * @description Maximum members per workspace (-1 = unlimited)
             */
            maxMembersPerWorkspace?: number;
            /** @description Monthly price */
            priceMonthly?: number;
            /** @description Yearly price */
            priceYearly?: number;
            /** @description Whether the plan is active */
            active?: boolean;
            /**
             * Format: date-time
             * @description Creation timestamp
             */
            createdAt?: string;
            /**
             * Format: date-time
             * @description Last update timestamp
             */
            updatedAt?: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getWorkspace: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Workspace ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Workspace found */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkspaceResponse"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Access denied */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Workspace not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    updateWorkspace: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Workspace ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateWorkspaceRequest"];
            };
        };
        responses: {
            /** @description Workspace updated */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkspaceResponse"];
                };
            };
            /** @description Invalid request data */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not workspace owner */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Workspace not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Name already exists */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getWorkspaceSettings: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Workspace ID */
                workspaceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Workspace settings retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkspaceSettingsResponse"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    updateWorkspaceSettings: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Workspace ID */
                workspaceId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateWorkspaceSettingsRequest"];
            };
        };
        responses: {
            /** @description Workspace settings updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkspaceSettingsResponse"];
                };
            };
            /** @description Invalid request body */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getUserSettings: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description User settings retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserSettingsResponse"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    updateUserPreferences: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateUserPreferencesRequest"];
            };
        };
        responses: {
            /** @description User preferences updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserSettingsResponse"];
                };
            };
            /** @description Invalid request body */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getAppConfig: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Config key */
                key: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description App config retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AppConfigResponse"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description App config not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    setAppConfig: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Config key */
                key: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetAppConfigRequest"];
            };
        };
        responses: {
            /** @description App config saved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AppConfigResponse"];
                };
            };
            /** @description Invalid request body */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    deleteAppConfig: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Config key */
                key: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description App config deleted successfully */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getProfile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Profile ID (UUID) */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Profile retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfileResponse"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Profile not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    updateProfile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Profile ID (UUID) */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateProfileRequest"];
            };
        };
        responses: {
            /** @description Profile updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfileResponse"];
                };
            };
            /** @description Invalid request data */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Forbidden - cannot update another user's profile */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Profile not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    deleteProfile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Profile ID (UUID) */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Profile deleted successfully */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Forbidden - cannot delete another user's profile */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Profile not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getMyProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Profile retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfileResponse"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Profile not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    updateMyProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateProfileRequest"];
            };
        };
        responses: {
            /** @description Profile updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfileResponse"];
                };
            };
            /** @description Invalid request data */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Profile not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    deleteMyProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Profile deleted successfully */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Profile not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getPreferences: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Preferences retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationPreferenceResponse"];
                };
            };
        };
    };
    updatePreferences: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdatePreferencesRequest"];
            };
        };
        responses: {
            /** @description Preferences updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationPreferenceResponse"];
                };
            };
            /** @description Invalid request payload */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    changeWorkspacePlan: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Workspace ID */
                workspaceId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ChangePlanRequest"];
            };
        };
        responses: {
            /** @description Plan changed */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubscriptionResponse"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Subscription or plan not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    createWorkspace: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateWorkspaceRequest"];
            };
        };
        responses: {
            /** @description Workspace created successfully */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkspaceResponse"];
                };
            };
            /** @description Invalid request data */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Workspace name already exists */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    addMember: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Workspace ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddWorkspaceMemberRequest"];
            };
        };
        responses: {
            /** @description Member added */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Invalid request data */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not workspace owner */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Workspace or user not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    deactivateWorkspace: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Workspace ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Workspace deactivated */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not workspace owner */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Workspace not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    activateWorkspace: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Workspace ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Workspace activated */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not workspace owner */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Workspace not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    temporalSearch: {
        parameters: {
            query: {
                /** @description Workspace ID to search within */
                workspaceId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TemporalSearchRequest"];
            };
        };
        responses: {
            /** @description Temporal search completed successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SearchResponse"];
                };
            };
            /** @description Invalid request parameters */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    reason: {
        parameters: {
            query: {
                /** @description Workspace ID */
                workspaceId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReasoningRequest"];
            };
        };
        responses: {
            /** @description Reasoning completed successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReasoningResponse"];
                };
            };
            /** @description Invalid request parameters */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    findRelationships: {
        parameters: {
            query: {
                /** @description Claim ID to find relationships for */
                claimId: string;
                /** @description Optional relationship type filter */
                type?: "supports" | "contradicts" | "references" | "derives_from" | "related";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Relationships retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RelationshipResponse"][];
                };
            };
        };
    };
    createRelationship: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateRelationshipRequest"];
            };
        };
        responses: {
            /** @description Relationship created successfully */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RelationshipResponse"];
                };
            };
            /** @description Invalid request or validation failed */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RelationshipResponse"];
                };
            };
            /** @description Relationship already exists with same source, target, and type */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RelationshipResponse"];
                };
            };
        };
    };
    getFeedbackHistory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                relationshipId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Feedback history retrieved */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeedbackResponse"][];
                };
            };
        };
    };
    submitFeedback: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                relationshipId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SubmitFeedbackRequest"];
            };
        };
        responses: {
            /** @description Feedback submitted */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeedbackResponse"];
                };
            };
            /** @description Relationship not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeedbackResponse"];
                };
            };
        };
    };
    generate: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MessageRequest"];
            };
        };
        responses: {
            /** @description Response generated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
            /** @description Invalid request payload */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal server error during generation */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    createProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateProfileRequest"];
            };
        };
        responses: {
            /** @description Profile created successfully */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfileResponse"];
                };
            };
            /** @description Invalid request data */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Profile already exists for this user */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    markAsRead: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Notification marked as read */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Notification not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    markAllAsRead: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description All notifications marked as read */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    listEntities: {
        parameters: {
            query: {
                /** @description Workspace ID */
                workspaceId: string;
                /** @description Optional entity type filter */
                type?: "person" | "place" | "organization" | "concept" | "technology" | "event" | "other";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Entities retrieved */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EntityResponse"][];
                };
            };
        };
    };
    createEntity: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateEntityRequest"];
            };
        };
        responses: {
            /** @description Entity created or returned */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EntityResponse"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EntityResponse"];
                };
            };
        };
    };
    getMemoriesForEntity: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                entityId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Links retrieved */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MemoryEntityLinkResponse"][];
                };
            };
        };
    };
    linkMemory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                entityId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LinkMemoryRequest"];
            };
        };
        responses: {
            /** @description Link created or returned */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MemoryEntityLinkResponse"];
                };
            };
            /** @description Entity not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MemoryEntityLinkResponse"];
                };
            };
        };
    };
    getAliases: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                entityId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Aliases retrieved */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string[];
                };
            };
        };
    };
    addAlias: {
        parameters: {
            query: {
                alias: string;
                type: "person" | "place" | "organization" | "concept" | "technology" | "event" | "other";
                workspaceId: string;
            };
            header?: never;
            path: {
                entityId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Alias added */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Entity not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    queryClaims: {
        parameters: {
            query?: {
                /** @description Filter by entity ID */
                entityId?: string;
                /** @description Filter by block ID */
                blockId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Claims retrieved */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClaimResponse"][];
                };
            };
        };
    };
    createClaim: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateClaimRequest"];
            };
        };
        responses: {
            /** @description Claim created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClaimResponse"];
                };
            };
            /** @description Invalid request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClaimResponse"];
                };
            };
            /** @description Entity not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClaimResponse"];
                };
            };
        };
    };
    disconnectIntegration: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Integration disconnected */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Integration not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    connectIntegration: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConnectIntegrationRequest"];
            };
        };
        responses: {
            /** @description Integration connected successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IntegrationResponse"];
                };
            };
            /** @description Integration not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    listIntegrations: {
        parameters: {
            query?: {
                status?: string;
                type?: string;
            };
            header?: never;
            path: {
                workspaceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Integrations retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IntegrationResponse"][];
                };
            };
        };
    };
    initializeIntegrations: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                workspaceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Integrations initialized successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IntegrationResponse"][];
                };
            };
        };
    };
    createSourceRequest: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateSourceRequestRequest"];
            };
        };
        responses: {
            /** @description Source request created successfully */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SourceRequestResponse"];
                };
            };
        };
    };
    testConnection: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                integrationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Connection test passed */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IntegrationResponse"];
                };
            };
            /** @description Connection test failed */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Integration not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    initiateOAuth: {
        parameters: {
            query?: {
                integrationId?: string;
                workspaceId?: string;
            };
            header?: never;
            path: {
                provider: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OAuth flow initiated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OAuthInitiateResponse"];
                };
            };
            /** @description Invalid provider or config */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Integration not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    testConnection_1: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                integrationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Connection test passed */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IntegrationResponse"];
                };
            };
            /** @description Connection test failed */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Integration not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    syncAll: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                integrationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Sync started and content published for extraction */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IntegrationResponse"];
                };
            };
            /** @description Not connected */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Integration not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    syncPage: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                integrationId: string;
                pageId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Page synced and content published for extraction */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IntegrationResponse"];
                };
            };
            /** @description Not connected */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Integration or page not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    search: {
        parameters: {
            query?: {
                query?: string;
                pageSize?: number;
            };
            header?: never;
            path: {
                integrationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Search results retrieved */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: Record<string, never>;
                    };
                };
            };
            /** @description Not connected or token invalid */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Integration not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    queryDatabase: {
        parameters: {
            query?: {
                pageSize?: number;
            };
            header?: never;
            path: {
                integrationId: string;
                databaseId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Query results retrieved */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: Record<string, never>;
                    };
                };
            };
            /** @description Not connected or token invalid */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Database or integration not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    list: {
        parameters: {
            query: {
                workspaceId: string;
                offset?: number;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventNodeResponse"][];
                };
            };
        };
    };
    create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateEventNodeRequest"];
            };
        };
        responses: {
            /** @description Created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventNodeDetailResponse"];
                };
            };
        };
    };
    list_1: {
        parameters: {
            query?: {
                workspaceId?: string;
                offset?: number;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GraphEntityResponse"][];
                };
            };
        };
    };
    create_1: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateGraphEntityRequest"];
            };
        };
        responses: {
            /** @description Created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GraphEntityResponse"];
                };
            };
        };
    };
    resolve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                conflictId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ResolveConflictRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConflictResponse"];
                };
            };
        };
    };
    acknowledge: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                conflictId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConflictResponse"];
                };
            };
        };
    };
    subscribeWorkspace: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Workspace ID */
                workspaceId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SubscribeRequest"];
            };
        };
        responses: {
            /** @description Subscription created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubscriptionResponse"];
                };
            };
            /** @description Invalid request or workspace already subscribed */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    cancelSubscription: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Workspace ID */
                workspaceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Subscription cancelled */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubscriptionResponse"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Subscription not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    signup: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SignupRequest"];
            };
        };
        responses: {
            /** @description User created successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TokenPairResponse"];
                };
            };
            /** @description Invalid request payload or validation failed */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Username already exists */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    refresh: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RefreshRequest"];
            };
        };
        responses: {
            /** @description Token refreshed successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TokenPairResponse"];
                };
            };
            /** @description Invalid request payload */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Invalid or expired refresh token */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    googleLogin: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["GoogleOAuthRequest"];
            };
        };
        responses: {
            /** @description OAuth authentication successful */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GoogleOAuthResponse"];
                };
            };
            /** @description Invalid request payload or authorization code */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description OAuth authentication failed */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    initiateGoogleOAuth: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OAuth flow initiated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OAuthAuthorizeResponse"];
                };
            };
            /** @description Internal server error during OAuth initialization */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    handleGoogleOAuthCallback: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["OAuthCallbackRequest"];
            };
        };
        responses: {
            /** @description OAuth callback successful - user authenticated */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GoogleOAuthResponse"];
                };
            };
            /** @description Invalid request payload or state mismatch */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description OAuth authentication failed */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    logout: {
        parameters: {
            query?: never;
            header: {
                Authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LogoutRequest"];
            };
        };
        responses: {
            /** @description Logout successful */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Invalid request payload */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized - invalid or missing token */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    logoutAll: {
        parameters: {
            query?: never;
            header: {
                Authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Logged out from all devices successfully */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized - invalid or missing token */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginRequest"];
            };
        };
        responses: {
            /** @description Login successful */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TokenPairResponse"];
                };
            };
            /** @description Invalid request payload */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Invalid credentials or account locked */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Too many failed login attempts */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getActivityLog: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Activity ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Activity found */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActivityLogResponse"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Activity not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getMyWorkspaces: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Workspaces retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkspaceResponse"][];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getMemberWorkspaces: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Member workspaces retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkspaceResponse"][];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getActiveWorkspaces: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Active workspaces retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkspaceResponse"][];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getTimeline: {
        parameters: {
            query: {
                objectType: string;
                objectId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TemporalEventResponse"][];
                };
            };
        };
    };
    getChangesSince: {
        parameters: {
            query: {
                workspaceId: string;
                since: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TemporalEventResponse"][];
                };
            };
        };
    };
    getAllAppConfigs: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description App configs retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AppConfigResponse"][];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    search_1: {
        parameters: {
            query: {
                /** @description Workspace ID to search within */
                workspaceId: string;
                /** @description Search query string */
                query: string;
                /** @description Maximum number of alternative results to return */
                limit?: number;
                /** @description Number of alternative results to skip */
                offset?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Search completed successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SearchResponse"];
                };
            };
            /** @description Invalid request parameters */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Access denied to workspace */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getRelationship: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                relationshipId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Relationship found */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RelationshipResponse"];
                };
            };
            /** @description Relationship not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RelationshipResponse"];
                };
            };
        };
    };
    deleteRelationship: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                relationshipId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Relationship deleted successfully */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Relationship not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    listNotifications: {
        parameters: {
            query?: {
                limit?: number;
                offset?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Notifications retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationResponse"][];
                };
            };
        };
    };
    listUnreadNotifications: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Unread notifications retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationResponse"][];
                };
            };
        };
    };
    getUnreadCount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Unread count retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UnreadCountResponse"];
                };
            };
        };
    };
    streamNotifications: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/event-stream": components["schemas"]["SseEmitter"];
                    "application/json": components["schemas"]["SseEmitter"];
                };
            };
        };
    };
    getEntityEvolution: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Entity ID */
                entityId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Evolution timeline retrieved */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EntityEvolutionResponse"];
                };
            };
            /** @description Entity not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EntityEvolutionResponse"];
                };
            };
        };
    };
    getClaimHistory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Entity ID */
                entityId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description History retrieved */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TemporalClaimHistoryResponse"];
                };
            };
            /** @description Entity not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TemporalClaimHistoryResponse"];
                };
            };
        };
    };
    getClaimsValidAt: {
        parameters: {
            query: {
                /** @description Point in time (ISO-8601) */
                time: string;
            };
            header?: never;
            path: {
                /** @description Entity ID */
                entityId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Claims retrieved */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClaimResponse"][];
                };
            };
            /** @description Invalid time format */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClaimResponse"][];
                };
            };
        };
    };
    getClaimLineage: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Claim ID */
                claimId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Lineage retrieved */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClaimLineageResponse"];
                };
            };
        };
    };
    getEntity: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                entityId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Entity found */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EntityResponse"];
                };
            };
            /** @description Entity not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EntityResponse"];
                };
            };
        };
    };
    deleteEntity: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                entityId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Entity deleted */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Entity not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getEntitiesForMemory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memoryId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Links retrieved */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MemoryEntityLinkResponse"][];
                };
            };
        };
    };
    getClaim: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                claimId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Claim found */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClaimResponse"];
                };
            };
            /** @description Claim not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClaimResponse"];
                };
            };
        };
    };
    deleteClaim: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                claimId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Claim deleted */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Claim not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getIntegration: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Integration retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IntegrationResponse"];
                };
            };
            /** @description Integration not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getSyncStats: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Sync stats retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncStatsResponse"];
                };
            };
            /** @description Integration not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    listSourceRequests: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                workspaceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Source requests retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SourceRequestResponse"][];
                };
            };
        };
    };
    listUsers: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                integrationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Users retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: Record<string, never>;
                    }[];
                };
            };
            /** @description Not connected or token invalid */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Integration not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getTeamInfo: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                integrationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Team info retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: Record<string, never>;
                    };
                };
            };
            /** @description Not connected or token invalid */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Integration not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    listChannels: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                integrationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Channels retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: Record<string, never>;
                    }[];
                };
            };
            /** @description Not connected or token invalid */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Integration not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getChannelHistory: {
        parameters: {
            query?: {
                limit?: number;
            };
            header?: never;
            path: {
                integrationId: string;
                channelId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Messages retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: Record<string, never>;
                    }[];
                };
            };
            /** @description Not connected or token invalid */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Integration not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    handleCallback: {
        parameters: {
            query?: {
                code?: string;
                state?: string;
                error?: string;
            };
            header?: never;
            path: {
                provider: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Redirect to frontend with error */
            302: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    listUsers_1: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                integrationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Users retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: Record<string, never>;
                    }[];
                };
            };
            /** @description Not connected or token invalid */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Integration not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    listPages: {
        parameters: {
            query?: {
                pageSize?: number;
            };
            header?: never;
            path: {
                integrationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Pages retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: Record<string, never>;
                    }[];
                };
            };
            /** @description Not connected or token invalid */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Integration not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getPage: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                integrationId: string;
                pageId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Page retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: Record<string, never>;
                    };
                };
            };
            /** @description Not connected or token invalid */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Page or integration not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    listDatabases: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                integrationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Databases retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: Record<string, never>;
                    }[];
                };
            };
            /** @description Not connected or token invalid */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Integration not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getDatabase: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                integrationId: string;
                databaseId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Database retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: Record<string, never>;
                    };
                };
            };
            /** @description Not connected or token invalid */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Database or integration not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getBlockChildren: {
        parameters: {
            query?: {
                pageSize?: number;
            };
            header?: never;
            path: {
                integrationId: string;
                blockId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Block children retrieved */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: Record<string, never>;
                    }[];
                };
            };
            /** @description Not connected or token invalid */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Block or integration not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    temporalQuery: {
        parameters: {
            query: {
                entityId: string;
                from: string;
                to: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventNodeResponse"][];
                };
            };
        };
    };
    findPaths: {
        parameters: {
            query: {
                from: string;
                to: string;
                maxDepth?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GraphPathResponse"][];
                };
            };
        };
    };
    get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventNodeDetailResponse"];
                };
            };
        };
    };
    delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    get_1: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GraphEntityResponse"];
                };
            };
        };
    };
    delete_1: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getNeighbors: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GraphEntityResponse"][];
                };
            };
        };
    };
    getEvents: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventNodeResponse"][];
                };
            };
        };
    };
    listConflicts: {
        parameters: {
            query: {
                workspaceId: string;
                status?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConflictResponse"][];
                };
            };
        };
    };
    getConflict: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                conflictId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConflictResponse"];
                };
            };
        };
    };
    getUsage: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Workspace ID */
                workspaceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Usage records retrieved */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UsageResponse"][];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getWorkspaceSubscription: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Workspace ID */
                workspaceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Subscription found */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubscriptionResponse"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Subscription not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    checkLimits: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Workspace ID */
                workspaceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Limit checks retrieved */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LimitCheckResponse"][];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getPlans: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Plans retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlanResponse"][];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getPlan: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Plan name */
                name: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Plan found */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlanResponse"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Plan not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getActivityLogList: {
        parameters: {
            query?: {
                offset?: number;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Activities retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActivityLogResponse"][];
                };
            };
            /** @description Invalid request parameters */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    removeMember: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Workspace ID */
                id: string;
                /** @description Member user ID */
                memberId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Member removed */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not workspace owner */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Workspace not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    deleteNotification: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Notification deleted */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Notification not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
