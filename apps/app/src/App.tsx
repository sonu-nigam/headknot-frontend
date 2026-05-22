import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Signup from './pages/Signup';
import MemoryPage from './pages/Memory/MemoryPage';
import NotFoundPage from './pages/NotFoundPage';
import GoogleCallback from './pages/GoogleCallback';
import { AccountPage } from './pages/Account/AccountPage';
import { BillingPage } from './pages/Billing/BillingPage';
import { CheckoutSuccessPage } from './pages/Billing/CheckoutSuccessPage';
import { CheckoutCancelPage } from './pages/Billing/CheckoutCancelPage';
import { NotificationsPage } from './pages/Notifications/NotificationsPage';
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
                path="/account"
                element={
                    <ProtectedRoute>
                        <AccountPage />
                    </ProtectedRoute>
                }
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
                element={
                    <ProtectedRoute>
                        <BillingPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/billing/success"
                element={
                    <ProtectedRoute>
                        <CheckoutSuccessPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/billing/cancel"
                element={
                    <ProtectedRoute>
                        <CheckoutCancelPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/notifications"
                element={
                    <ProtectedRoute>
                        <NotificationsPage />
                    </ProtectedRoute>
                }
            />
            <Route path="/archives" element={<Archives />} />
        </Routes>
        <Toaster position="top-right" richColors closeButton />
        </>
    );
}
