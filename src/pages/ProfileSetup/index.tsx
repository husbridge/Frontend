import { Layout } from "@components/index"
import { useParams } from "react-router-dom"
import ProfileSetupBody from "./components/ProfileSetupBody"

// Two routes point here: `/profile-setup` (self, no :id — talent/agency
// editing their own profile) and `/talents/:id/profile-setup` (a manager
// editing a roster talent's profile). Same body component either way —
// husridge-server's canEditTalentProfile enforces the actual permission
// check, this page just forwards whichever id is present.
const ProfileSetup = () => {
    const { id } = useParams<{ id?: string }>()

    return (
        <Layout>
            <div className="pt-24 px-4 sm:px-8 pb-12">
                <ProfileSetupBody userId={id} />
            </div>
        </Layout>
    )
}

export default ProfileSetup
