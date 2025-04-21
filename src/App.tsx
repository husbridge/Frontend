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
import Settings from "@pages/Settings"
import Talents from "@pages/Talent"
import AllInquiries from "@pages/Talent/subnavigations/allInquiries"
import TalentCalendar from "@pages/Talent/subnavigations/calendar"
import TalentInformation from "@pages/Talent/subnavigations/talentInformation"
import Team from "@pages/Team"
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom"

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
