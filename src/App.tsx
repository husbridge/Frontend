import { Route, Routes, Navigate, useLocation, Outlet } from "react-router-dom"
import Welcome from "@pages/auth/welcome"
import AgencySignUp from "@pages/auth/agencySignUp"
import ManagerSignUp from "@pages/auth/managerSignUp"
import TalentSignUp from "@pages/auth/talentSignUp"
import Login from "@pages/auth/login"
import ForgetPassword from "@pages/auth/forget"
import CreateNewPassword from "@pages/auth/createNewpassword"
import Dashboard from "@pages/Dashboard"
import Talents from "@pages/Talent"
import TalentInformation from "@pages/Talent/subnavigations/talentInformation"
import AllInquiries from "@pages/Talent/subnavigations/allInquiries"
import TalentCalendar from "@pages/Talent/subnavigations/calendar"
import CalendarManagement from "@pages/CalendarManagement"
import Team from "@pages/Team"
import Settings from "@pages/Settings"
import InquiryManagent from "@pages/InquiryManagement"
import Messaging from "@pages/Messaging"
import Contact from "@pages/Contact"
import useAuth from "@hooks/auth/useAuth"
import ConfirmEmailAddress from "@pages/auth/confirmEmailAddress"
import ClientLogin from "@pages/auth/clientSignIn"
import HelpSupport from "@pages/Help&Support"
import ValidateClientEmail from "@pages/Contact/components/validateClientEmail"

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
    console.log(
        "LOGSSSS: ",
        import.meta.env.AWS_BUCKET_NAME,
        import.meta.env.AWS_ACCESS_KEY_ID,
        import.meta.env.AWS_SECRET_ACCESS_KEY
    )
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
                    element={<InquiryManagent />}
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
            <Route path="/agency-signup" element={<AgencySignUp />} />
            <Route path="/manager-signup" element={<ManagerSignUp />} />
            <Route path="/talent-signup" element={<TalentSignUp />} />
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
