import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Signup from './pages/Signup';
import MemoryPage from './pages/Memory/MemoryPage';
import NotFoundPage from './pages/NotFoundPage';
import GoogleCallback from './pages/GoogleCallback';
import { SettingsLayout } from './pages/Settings/SettingsLayout';
import { AccountSection } from './pages/Settings/sections/AccountSection';
import { WorkspaceSection } from './pages/Settings/sections/WorkspaceSection';
import { PreferencesSection } from './pages/Settings/sections/PreferencesSection';
import { NotificationsSettingsSection } from './pages/Settings/sections/NotificationsSettingsSection';
import { BillingSection } from './pages/Settings/sections/BillingSection';
import { NotificationsInboxPage } from './pages/Notifications/NotificationsInboxPage';
import Archives from './pages/Archives';

import Workspace from './pages/Workspace';
import Activity from './pages/Activity';
import { IntegrationsPage } from './pages/Integrations/IntegrationsPage';
import { IntegrationDetailPage } from './pages/Integrations/IntegrationDetailPage';
import { ControlPanelPage } from './pages/ControlPanel/ControlPanelPage';
import { SearchRouter } from './pages/Search/SearchRouter';
import { KnowledgeResultsPage } from './pages/Search/KnowledgeResultsPage';
import { CausalResultsPage } from './pages/Search/CausalResultsPage';
import { ProceduralResultsPage } from './pages/Search/ProceduralResultsPage';
import { ComparativeResultsPage } from './pages/Search/ComparativeResultsPage';
import { ImpactAnalysisPage } from './pages/Search/ImpactAnalysisPage';
import { ReasoningResultsPage } from './pages/Search/ReasoningResultsPage';
import { ExtractionEnginePage } from './pages/ExtractionEngine/ExtractionEnginePage';
import { ClaimsLibraryPage } from './pages/ClaimsLibrary/ClaimsLibraryPage';
import { RefineKnowledgePage } from './pages/RefineKnowledge/RefineKnowledgePage';
import { RelationshipGraphPage } from './pages/RelationshipGraph/RelationshipGraphPage';
import { MemoryCenterPage } from './pages/MemoryCenter/MemoryCenterPage';
import { KnowledgeGraphPage } from './pages/KnowledgeGraph/KnowledgeGraphPage';
import OnboardingPage from './pages/Onboarding/OnboardingPage';

export default function App() {
    const loc = useLocation();
    return (
        <>
        <Routes location={loc}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route
                path="/onboarding"
                element={
                    <ProtectedRoute>
                        <OnboardingPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            {/*<Route
                path="/memory"
                element={
                    <ProtectedRoute>
                        <MemoryListPage />
                    </ProtectedRoute>
                }
            />*/}
            <Route
                path="/:memorySlug"
                element={
                    <ProtectedRoute>
                        <MemoryPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/search"
                element={
                    <ProtectedRoute>
                        <SearchRouter />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/discover"
                element={
                    <ProtectedRoute>
                        <KnowledgeResultsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/causal"
                element={
                    <ProtectedRoute>
                        <CausalResultsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/procedural"
                element={
                    <ProtectedRoute>
                        <ProceduralResultsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/compare"
                element={
                    <ProtectedRoute>
                        <ComparativeResultsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/impact"
                element={
                    <ProtectedRoute>
                        <ImpactAnalysisPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/reasoning"
                element={
                    <ProtectedRoute>
                        <ReasoningResultsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/memory"
                element={
                    <ProtectedRoute>
                        <MemoryCenterPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/memory/graph"
                element={
                    <ProtectedRoute>
                        <RelationshipGraphPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/memory/extraction"
                element={
                    <ProtectedRoute>
                        <ExtractionEnginePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/memory/refine"
                element={
                    <ProtectedRoute>
                        <RefineKnowledgePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/memory/claims"
                element={
                    <ProtectedRoute>
                        <ClaimsLibraryPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/knowledge-graph"
                element={
                    <ProtectedRoute>
                        <KnowledgeGraphPage />
                    </ProtectedRoute>
                }
            />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <SettingsLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="account" replace />} />
                <Route path="account" element={<AccountSection />} />
                <Route path="workspace" element={<WorkspaceSection />} />
                <Route path="preferences" element={<PreferencesSection />} />
                <Route
                    path="notifications"
                    element={<NotificationsSettingsSection />}
                />
                <Route path="billing" element={<BillingSection />} />
            </Route>
            <Route
                path="/account"
                element={<Navigate to="/settings/account" replace />}
            />
            <Route
                path="/workspace"
                element={
                    <ProtectedRoute>
                        <Workspace />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/activity"
                element={
                    <ProtectedRoute>
                        <Activity />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/control-panel"
                element={
                    <ProtectedRoute>
                        <ControlPanelPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/integrations"
                element={
                    <ProtectedRoute>
                        <IntegrationsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/integrations/:integrationId"
                element={
                    <ProtectedRoute>
                        <IntegrationDetailPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/billing"
                element={<Navigate to="/settings/billing" replace />}
            />
            <Route
                path="/notifications"
                element={
                    <ProtectedRoute>
                        <NotificationsInboxPage />
                    </ProtectedRoute>
                }
            />
            <Route path="/archives" element={<Archives />} />
        </Routes>
        <Toaster position="top-right" richColors closeButton />
        </>
    );
}
