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
    "/memory/{id}/blocks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Replace blocks
         * @description Replace the full block list
         */
        put: operations["replaceBlocks"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/clusters/{clusterId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get cluster by ID
         * @description Retrieves a specific cluster with access check
         */
        get: operations["getCluster"];
        /**
         * Update cluster
         * @description Updates cluster name and/or description
         */
        put: operations["updateCluster"];
        post?: never;
        /**
         * Delete cluster
         * @description Permanently deletes cluster and all memories
         */
        delete: operations["permanentlyDeleteCluster"];
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
    "/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search all content
         * @description Performs full-text search across all indexed documents with optional filters
         */
        get: operations["search"];
        put?: never;
        /**
         * Search content (POST)
         * @description Performs full-text search with complex query parameters via POST
         */
        post: operations["searchPost"];
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
    "/memory": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List memories by workspace
         * @description List memories in a workspace, optionally filtered by cluster and/or status
         */
        get: operations["listByWorkspace"];
        put?: never;
        /**
         * Create memory
         * @description Create a new memory (note/task/decision/...) in a workspace
         */
        post: operations["createMemory"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/memory/{id}/convert": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Convert type
         * @description Convert a memory to another type (e.g., note → task)
         */
        post: operations["convertType"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/clusters": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get clusters by workspace
         * @description Retrieves clusters for a workspace, optionally filtered by status
         */
        get: operations["getClusters"];
        put?: never;
        /**
         * Create cluster
         * @description Creates a new cluster within a workspace
         */
        post: operations["createCluster"];
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
    "/activity/read": {
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
        post: operations["read"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/activity/create": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create activity
         * @description Create an activity and emit ActivityCreated event
         */
        post: operations["create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/memory/{memoryId}/unarchive": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Unarchive a memory
         * @description Unarchives a memory, returning it to active status
         */
        patch: operations["unarchiveMemory"];
        trace?: never;
    };
    "/memory/{memoryId}/trash": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Trash a memory
         * @description Moves a memory to trash (recoverable for 30 days)
         */
        patch: operations["trashMemory"];
        trace?: never;
    };
    "/memory/{memoryId}/restore": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Restore a memory from trash
         * @description Restores a memory from trash to active status
         */
        patch: operations["restoreMemory"];
        trace?: never;
    };
    "/memory/{memoryId}/archive": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Archive a memory
         * @description Archives a memory
         */
        patch: operations["archiveMemory"];
        trace?: never;
    };
    "/memory/{id}/title": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update title
         * @description Change only the memory title (optimistic-locked via If-Match)
         */
        patch: operations["updateTitle"];
        trace?: never;
    };
    "/clusters/{clusterId}/trash": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Trash cluster
         * @description Moves cluster and memories to trash
         */
        patch: operations["trashCluster"];
        trace?: never;
    };
    "/clusters/{clusterId}/restore": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Restore cluster
         * @description Restores cluster and memories from trash
         */
        patch: operations["restoreCluster"];
        trace?: never;
    };
    "/clusters/{clusterId}/archive": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Archive cluster
         * @description Archives cluster and active memories
         */
        patch: operations["archiveCluster"];
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
    "/search/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get search statistics
         * @description Retrieves statistics about indexed documents
         */
        get: operations["getStatistics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search/stats/workspace/{workspaceId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get workspace search statistics
         * @description Retrieves search statistics for a specific workspace
         */
        get: operations["getWorkspaceStatistics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search/recent": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get recent documents
         * @description Retrieves recently created/updated documents across all types
         */
        get: operations["getRecentDocuments"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search/recent/workspace/{workspaceId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get recent documents by workspace
         * @description Retrieves recently created/updated documents for a specific workspace
         */
        get: operations["getRecentDocumentsByWorkspace"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search/document/{entityType}/{entityId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get document by entity
         * @description Retrieves a search document by its entity ID and type
         */
        get: operations["getDocumentByEntity"];
        put?: never;
        post?: never;
        /**
         * Delete search document
         * @description Deletes a search document by entity ID and type (internal use)
         */
        delete: operations["deleteDocument"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search/document/{entityType}/{entityId}/exists": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Check if document exists
         * @description Checks if a document exists for the given entity ID and type
         */
        get: operations["documentExists"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search/autocomplete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Autocomplete search
         * @description Searches for documents by title prefix for autocomplete functionality
         */
        get: operations["autocomplete"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/memory/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get memory
         * @description Fetch a memory with its blocks
         */
        get: operations["getMemory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/activity/list": {
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
        get: operations["list"];
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
    "/memory/{memoryId}": {
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
         * Permanently delete a memory
         * @description Permanently deletes a memory. This action is irreversible.
         */
        delete: operations["deleteMemory"];
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
        BlockDto: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            parentId?: string;
            /** Format: int32 */
            index?: number;
            kind?: string;
            data?: Record<string, never>;
        };
        UpdateMemoryRequest: {
            blocks?: components["schemas"]["BlockDto"][];
        };
        MemoryResponse: {
            /** Format: uuid */
            id?: string;
            type?: string;
            /** Format: uuid */
            workspaceId?: string;
            /** Format: uuid */
            clusterId?: string;
            title?: string;
            status?: string;
            /** Format: date-time */
            trashedAt?: string;
            primaryAtomic?: string;
            atomicBlocks?: string[];
            atomicSignals?: string[];
            /** Format: int32 */
            version?: number;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
            blocks?: components["schemas"]["BlockDto"][];
        };
        /** @description Request to create a new cluster */
        UpdateClusterRequest: {
            /**
             * @description Cluster name
             * @example New Cluster
             */
            name: string;
            /**
             * @description Cluster description
             * @example A cluster for memory collection
             */
            description?: string;
        };
        /** @description Cluster details response */
        ClusterResponse: {
            /**
             * Format: uuid
             * @description Cluster ID
             */
            id?: string;
            /** @description Cluster name */
            name?: string;
            /** @description Cluster description */
            description?: string;
            /**
             * Format: uuid
             * @description Workspace ID
             */
            workspaceId?: string;
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
            /**
             * Format: date-time
             * @description deletedAt timestamp
             */
            deletedAt?: string;
            /** @description Current status of the Cluster */
            status?: string;
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
        SearchQueryRequest: {
            query?: string;
            entityType?: string;
            /** Format: uuid */
            workspaceId?: string;
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            size?: number;
            sortBy?: string;
            sortDirection?: string;
        };
        PageSearchResultDTO: {
            /** Format: int32 */
            totalPages?: number;
            /** Format: int64 */
            totalElements?: number;
            /** Format: int32 */
            size?: number;
            content?: components["schemas"]["SearchResultDTO"][];
            /** Format: int32 */
            number?: number;
            sort?: components["schemas"]["SortObject"][];
            /** Format: int32 */
            numberOfElements?: number;
            first?: boolean;
            last?: boolean;
            pageable?: components["schemas"]["PageableObject"];
            empty?: boolean;
        };
        PageableObject: {
            /** Format: int64 */
            offset?: number;
            sort?: components["schemas"]["SortObject"][];
            paged?: boolean;
            /** Format: int32 */
            pageNumber?: number;
            /** Format: int32 */
            pageSize?: number;
            unpaged?: boolean;
        };
        SearchResultDTO: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            entityId?: string;
            entityType?: string;
            /** Format: uuid */
            workspaceId?: string;
            title?: string;
            content?: string;
            status?: string;
            createdBy?: string;
            metadata?: {
                [key: string]: Record<string, never>;
            };
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
            /** Format: double */
            relevanceScore?: number;
            highlightedTitle?: string;
            highlightedSnippet?: string;
        };
        SortObject: {
            direction?: string;
            nullHandling?: string;
            ascending?: boolean;
            property?: string;
            ignoreCase?: boolean;
        };
        /** @description Profile creation data */
        CreateProfileRequest: {
            firstName: string;
            lastName?: string;
            email: string;
        };
        CreateMemoryRequest: {
            type?: string;
            /** Format: uuid */
            workspaceId?: string;
            /** Format: uuid */
            clusterId?: string;
            title?: string;
            blocks?: components["schemas"]["BlockDto"][];
        };
        MemoryId: {
            /** Format: uuid */
            value?: string;
        };
        /** @description Request to create a new cluster */
        CreateClusterRequest: {
            /**
             * @description Cluster name
             * @example New Cluster
             */
            name: string;
            /**
             * @description Cluster description
             * @example A cluster for memory collection
             */
            description?: string;
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
        ReadRequest: {
            /** Format: uuid */
            id?: string;
        };
        ActivityResponse: {
            /** Format: uuid */
            id?: string;
            title?: string;
            description?: string;
            /** Format: date-time */
            createdAt?: string;
        };
        CreateRequest: {
            title: string;
            description?: string;
        };
        UpdateTitleRequest: {
            title: string;
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
            /** @description Access denied */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkspaceResponse"];
                };
            };
            /** @description Workspace not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkspaceResponse"];
                };
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
            /** @description Not workspace owner */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkspaceResponse"];
                };
            };
            /** @description Workspace not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkspaceResponse"];
                };
            };
            /** @description Name already exists */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkspaceResponse"];
                };
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
                content: {
                    "application/json": components["schemas"]["ProfileResponse"];
                };
            };
            /** @description Profile not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfileResponse"];
                };
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
                content: {
                    "application/json": components["schemas"]["ProfileResponse"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfileResponse"];
                };
            };
            /** @description Forbidden - cannot update another user's profile */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfileResponse"];
                };
            };
            /** @description Profile not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfileResponse"];
                };
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
                content: {
                    "application/json": components["schemas"]["ProfileResponse"];
                };
            };
            /** @description Profile not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfileResponse"];
                };
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
                content: {
                    "application/json": components["schemas"]["ProfileResponse"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfileResponse"];
                };
            };
            /** @description Profile not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfileResponse"];
                };
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
    replaceBlocks: {
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
                "application/json": components["schemas"]["UpdateMemoryRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MemoryResponse"];
                };
            };
        };
    };
    getCluster: {
        parameters: {
            query: {
                workspaceId: string;
            };
            header?: never;
            path: {
                clusterId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Cluster found */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ClusterResponse"];
                };
            };
            /** @description Cluster not found or access denied */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    updateCluster: {
        parameters: {
            query: {
                workspaceId: string;
            };
            header?: never;
            path: {
                clusterId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateClusterRequest"];
            };
        };
        responses: {
            /** @description Cluster updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ClusterResponse"];
                };
            };
            /** @description Invalid request payload */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Access denied to update cluster */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Cluster not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    permanentlyDeleteCluster: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                clusterId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Cluster deleted successfully */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Access denied or immutable cluster */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Cluster not found */
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
                content: {
                    "application/json": components["schemas"]["WorkspaceResponse"];
                };
            };
            /** @description Workspace name already exists */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkspaceResponse"];
                };
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
    search: {
        parameters: {
            query: {
                /** @description Search query */
                query: string;
                /** @description Filter by entity type (e.g., Activity, Memory) */
                entityType?: string;
                /** @description Filter by workspace ID */
                workspaceId?: string;
                /** @description Page number (0-based) */
                page?: number;
                /** @description Page size */
                size?: number;
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
                    "*/*": components["schemas"]["PageSearchResultDTO"];
                };
            };
        };
    };
    searchPost: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SearchQueryRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["PageSearchResultDTO"];
                };
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
                content: {
                    "application/json": components["schemas"]["ProfileResponse"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfileResponse"];
                };
            };
            /** @description Profile already exists for this user */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfileResponse"];
                };
            };
        };
    };
    listByWorkspace: {
        parameters: {
            query: {
                workspaceId: string;
                clusterId?: string;
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
                    "application/json": components["schemas"]["MemoryResponse"][];
                };
            };
        };
    };
    createMemory: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateMemoryRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MemoryResponse"];
                };
            };
        };
    };
    convertType: {
        parameters: {
            query: {
                toType: string;
            };
            header?: never;
            path: {
                id: components["schemas"]["MemoryId"];
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
                    "application/json": components["schemas"]["MemoryResponse"];
                };
            };
        };
    };
    getClusters: {
        parameters: {
            query: {
                workspaceId: string;
                status?: "ACTIVE" | "ARCHIVED" | "TRASHED" | "DELETED";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Clusters retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ClusterResponse"][];
                };
            };
        };
    };
    createCluster: {
        parameters: {
            query: {
                workspaceId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateClusterRequest"];
            };
        };
        responses: {
            /** @description Cluster created successfully */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ClusterResponse"];
                };
            };
            /** @description Invalid request payload */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Cluster with same name already exists */
            409: {
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
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TokenPairResponse"];
                };
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
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TokenPairResponse"];
                };
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
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GoogleOAuthResponse"];
                };
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
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OAuthAuthorizeResponse"];
                };
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
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GoogleOAuthResponse"];
                };
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
            /** @description OK */
            200: {
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
            /** @description OK */
            200: {
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
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TokenPairResponse"];
                };
            };
        };
    };
    read: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReadRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActivityResponse"];
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
                "application/json": components["schemas"]["CreateRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActivityResponse"];
                };
            };
        };
    };
    unarchiveMemory: {
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
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MemoryResponse"];
                };
            };
        };
    };
    trashMemory: {
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
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MemoryResponse"];
                };
            };
        };
    };
    restoreMemory: {
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
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MemoryResponse"];
                };
            };
        };
    };
    archiveMemory: {
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
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MemoryResponse"];
                };
            };
        };
    };
    updateTitle: {
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
                "application/json": components["schemas"]["UpdateTitleRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MemoryResponse"];
                };
            };
        };
    };
    trashCluster: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                clusterId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Cluster trashed successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ClusterResponse"];
                };
            };
            /** @description Access denied or immutable cluster */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Cluster not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    restoreCluster: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                clusterId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Cluster restored successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ClusterResponse"];
                };
            };
            /** @description Access denied */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Cluster not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    archiveCluster: {
        parameters: {
            query: {
                workspaceId: string;
            };
            header?: never;
            path: {
                clusterId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Cluster archived successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": components["schemas"]["ClusterResponse"];
                };
            };
            /** @description Access denied or immutable cluster */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Cluster not found */
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
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkspaceResponse"][];
                };
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
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkspaceResponse"][];
                };
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
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkspaceResponse"][];
                };
            };
        };
    };
    getStatistics: {
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
                    "*/*": {
                        [key: string]: number;
                    };
                };
            };
        };
    };
    getWorkspaceStatistics: {
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
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": {
                        [key: string]: number;
                    };
                };
            };
        };
    };
    getRecentDocuments: {
        parameters: {
            query?: {
                /** @description Page number (0-based) */
                page?: number;
                /** @description Page size */
                size?: number;
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
                    "*/*": components["schemas"]["PageSearchResultDTO"];
                };
            };
        };
    };
    getRecentDocumentsByWorkspace: {
        parameters: {
            query?: {
                /** @description Page number (0-based) */
                page?: number;
                /** @description Page size */
                size?: number;
            };
            header?: never;
            path: {
                /** @description Workspace ID */
                workspaceId: string;
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
                    "*/*": components["schemas"]["PageSearchResultDTO"];
                };
            };
        };
    };
    getDocumentByEntity: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Entity ID */
                entityId: string;
                /** @description Entity type (e.g., Activity, Memory) */
                entityType: string;
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
                    "*/*": components["schemas"]["SearchResultDTO"];
                };
            };
        };
    };
    deleteDocument: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Entity ID */
                entityId: string;
                /** @description Entity type */
                entityType: string;
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
                content?: never;
            };
        };
    };
    documentExists: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Entity ID */
                entityId: string;
                /** @description Entity type */
                entityType: string;
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
                    "*/*": {
                        [key: string]: boolean;
                    };
                };
            };
        };
    };
    autocomplete: {
        parameters: {
            query: {
                /** @description Title prefix */
                prefix: string;
                /** @description Page number (0-based) */
                page?: number;
                /** @description Page size */
                size?: number;
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
                    "*/*": components["schemas"]["PageSearchResultDTO"];
                };
            };
        };
    };
    getMemory: {
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
                    "application/json": components["schemas"]["MemoryResponse"];
                };
            };
        };
    };
    list: {
        parameters: {
            query?: {
                offset?: number;
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
                    "application/json": components["schemas"]["ActivityResponse"][];
                };
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
    deleteMemory: {
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
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
