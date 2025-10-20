interface ImageMessageSkeletonProps {
    fileName: string
    progress: number
    isUserMessage: boolean
}

const ImageMessageSkeleton = ({
    fileName,
    progress,
    isUserMessage,
}: ImageMessageSkeletonProps) => {
    return (
        <div
            className={`${
                isUserMessage
                    ? "lg:ml-64 ml-20 flex justify-end mr-6"
                    : "ml-6 lg:mr-64 mr-20 "
            }`}
        >
            <div className="bg-black-5 max-w-fit rounded-[20px] p-4">
                <div
                    className={`${
                        isUserMessage
                            ? "text-[#FFC107] bg-black-100 rounded-[16px] p-4 rounded-tr-none"
                            : "text-[#01070E] rounded-tl-none rounded-[16px] bg-[#F5F5F5] p-4"
                    } text-sm`}
                >
                    <div className="space-y-3">
                        {/* Image skeleton with shimmer */}
                        <div className="relative">
                            <div className="w-64 h-48 bg-gray-200 rounded-lg animate-pulse overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer"></div>
                            </div>

                            {/* Progress overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
                                <div className="bg-white rounded-lg p-3 text-center">
                                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
                                    <p className="text-xs text-gray-700 font-medium">
                                        {progress}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* File name */}
                        <p className="text-xs text-gray-500 truncate">
                            {fileName}
                        </p>
                    </div>
                </div>

                {/* Timestamp skeleton */}
                <div
                    className={`${isUserMessage ? "text-end pr-1.5" : "text-start pl-1.5"} text-[#07305F] text-[10px] mt-2`}
                >
                    <div className="w-12 h-3 bg-gray-200 rounded animate-pulse mx-auto"></div>
                </div>
            </div>
        </div>
    )
}

export default ImageMessageSkeleton
