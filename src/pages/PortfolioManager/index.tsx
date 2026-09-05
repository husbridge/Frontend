import { Layout } from "@components/index"
import { useParams } from "react-router-dom"
import PortfolioManagerBody from "./components/PortfolioManagerBody"

// Two routes point here: `/portfolio` (self) and `/talents/:id/portfolio`
// (a manager managing a roster talent's portfolio) — see ProfileSetup's
// index.tsx for the same pattern.
const PortfolioManager = () => {
    const { id } = useParams<{ id?: string }>()

    return (
        <Layout>
            <div className="pt-24 px-4 sm:px-8 pb-12">
                <PortfolioManagerBody userId={id} />
            </div>
        </Layout>
    )
}

export default PortfolioManager
