import useAuth from "@hooks/auth/useAuth"
import AgencySignUp from "@pages/auth/agencySignUp"
import ClientLogin from "@pages/auth/clientSignIn"
import ConfirmEmailAddress from "@pages/auth/confirmEmailAddress"
import CreateNewPassword from "@pages/auth/createNewpassword"
import ForgetPassword from "@pages/auth/forget"
import Login from "@pages/auth/login"
import ManagerSignUp from "@pages/auth/managerSignUp"
import TalentSignUp from "@pages/auth/talentSignUp"
import Welcome from "@pages/auth/welcome"
import CalendarManagement from "@pages/CalendarManagement"
import Contact from "@pages/Contact"
import ValidateClientEmail from "@pages/Contact/components/validateClientEmail"
import Dashboard from "@pages/Dashboard"
import HelpSupport from "@pages/Help&Support"
import InquiryManagement from "@pages/InquiryManagement"
import Messaging from "@pages/Messaging"
import MyPage from "@pages/MyPage"
import { DEFAULT_MY_PAGE_SECTION } from "@pages/MyPage/sections"
import Settings from "@pages/Settings"
import Talents from "@pages/Talent"
import AllInquiries from "@pages/Talent/subnavigations/allInquiries"
import TalentCalendar from "@pages/Talent/subnavigations/calendar"
import TalentInformation from "@pages/Talent/subnavigations/talentInformation"
import Team from "@pages/Team"
import {
    Navigate,
    Outlet,
    Route,
    Routes,
    useLocation,
    useParams,
} from "react-router-dom"

// Small param-forwarding redirects — used both for /talents/:id/my-page
// (no section given, default to the first one) and for the backward-compat
// /talents/:id/profile-setup + /talents/:id/portfolio routes.
const RedirectToTalentMyPage = ({ section }: { section: string }) => {
    const { id } = useParams<{ id: string }>()
    return <Navigate to={`/talents/${id}/my-page/${section}`} replace />
}
const MyPageManagerIndexRedirect = () => (
    <RedirectToTalentMyPage section={DEFAULT_MY_PAGE_SECTION} />
)

const AuthenticatedRoutes: React.FC = () => {
    const { state } = useAuth()

    const location = useLocation()
    return state.isAuthenticated ? (
        <Outlet />
    ) : state.user?.userType === "client" ? (
        <Navigate to="/client-login" state={{ from: location }} replace />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    )
}

const UnauthenticatedRoutes: React.FC = () => {
    const { state } = useAuth()
    const location = useLocation()
    return !state.isAuthenticated ? (
        <Outlet />
    ) : state.user?.userType === "client" ? (
        <Navigate to="/inquiry-management" state={{ from: location }} replace />
    ) : (
        <Navigate to="/dashboard" state={{ from: location }} replace />
    )
}

function App() {
    const { state } = useAuth()

    return (
        <Routes>
            <Route element={<UnauthenticatedRoutes />}>
                <Route path="/" element={<Navigate replace to="/welcome" />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/client-login" element={<ClientLogin />} />
                <Route path="/forget-password" element={<ForgetPassword />} />
                <Route
                    path="/createNewPassword"
                    element={<CreateNewPassword />}
                />
            </Route>
            <Route element={<AuthenticatedRoutes />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/talents" element={<Talents />} />
                <Route path="/talents/:id" element={<TalentInformation />} />
                <Route
                    path="/talents/inquiries/:id"
                    element={<AllInquiries />}
                />

                <Route
                    path="/talents/events/:id"
                    element={<TalentCalendar />}
                />
                <Route path="/calendar" element={<CalendarManagement />} />
                <Route path="/team" element={<Team />} />
                <Route path="/settings" element={<Settings />} />
                {/* Phase 1 Step 5: "My Page" — the single editor for a
                    talent/agency's public page (Identity, About, Portfolio,
                    Reach, Track record — see sections.ts). Self and
                    manager-on-roster-talent share the same page component;
                    the section itself is config-driven, not one route per
                    section. */}
                <Route
                    path="/my-page"
                    element={
                        <Navigate
                            to={`/my-page/${DEFAULT_MY_PAGE_SECTION}`}
                            replace
                        />
                    }
                />
                <Route path="/my-page/:section" element={<MyPage />} />
                <Route
                    path="/talents/:id/my-page"
                    element={<MyPageManagerIndexRedirect />}
                />
                <Route
                    path="/talents/:id/my-page/:section"
                    element={<MyPage />}
                />
                {/* Backward-compat redirects — these URLs existed briefly
                    during this PR's earlier rounds; keep them resolving
                    rather than 404ing for anyone who bookmarked one. */}
                <Route
                    path="/profile-setup"
                    element={
                        <Navigate
                            to={`/my-page/${DEFAULT_MY_PAGE_SECTION}`}
                            replace
                        />
                    }
                />
                <Route
                    path="/portfolio"
                    element={<Navigate to="/my-page/portfolio" replace />}
                />
                <Route
                    path="/talents/:id/profile-setup"
                    element={<RedirectToTalentMyPage section={DEFAULT_MY_PAGE_SECTION} />}
                />
                <Route
                    path="/talents/:id/portfolio"
                    element={<RedirectToTalentMyPage section="portfolio" />}
                />
                <Route
                    path="/inquiry-management"
                    element={<InquiryManagement />}
                />
                <Route
                    path="/messaging"
                    element={
                        state.user?.hasAgency &&
                        state.user?.userType === "talent" ? (
                            <Navigate to="/dashboard" />
                        ) : (
                            <Messaging />
                        )
                    }
                />
                <Route path="/help&support" element={<HelpSupport />} />
            </Route>
            <Route>
                <Route path="/agency-signup" element={<AgencySignUp />} />
                <Route path="/manager-signup" element={<ManagerSignUp />} />
                <Route path="/talent-signup" element={<TalentSignUp />} />
            </Route>
            <Route
                path="/confirm-email-address"
                element={<ConfirmEmailAddress />}
            />
            <Route path="/confirm-inquiry" element={<ValidateClientEmail />} />
            <Route path="/contact/:uniqueName" element={<Contact />} />
        </Routes>
    )
}

export default App
