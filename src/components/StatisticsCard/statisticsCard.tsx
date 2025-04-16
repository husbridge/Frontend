interface StatisticsCardInterface {
    title: string
    icon: string
    total: number | string
}
const StatisticsCard = ({ title, icon, total }: StatisticsCardInterface) => {
    return (
        <div className="bg-white-100 p-4 rounded-[8px] w-full sm:mb-0 mb-4">
            <div className="flex justify-between items-center">
                <p className="md:text-3md text-2md font-medium">{title}</p>
                <img src={icon} alt="" />
            </div>
            <p className="md:text-2lg text-[28px] my-4">{total}</p>
        </div>
    )
}

export default StatisticsCard
