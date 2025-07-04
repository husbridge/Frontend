import { useState } from "react";
import { LoadingState } from "@components/index";
import { useGetChatFileUrl } from "@hooks/useFile";
import { Data as ChatData } from "type/api/messaging.types";

interface Props {
    newItem: ChatData;
}

const ImageWithAwsHook = ({ newItem }: Props) => {
    const { data, isLoading } = useGetChatFileUrl(newItem.metadata.url);

    const [failed, setFailed] = useState(false);

    const handleImageError = () => {
        setFailed(true);
    }

    if (failed) {
        return (
            <div className="max-w-full h-32 rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Image unavailable</span>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {isLoading ? (
                <LoadingState />
            ): (
                <>
                    <img
                    src={data?.data?.url}
                    alt="Shared image"
                    className="max-w-full h-auto rounded-lg max-h-64 object-contain"
                    onError={handleImageError}
                    />
                    <div className="hidden text-red-500 text-xs">
                        Failed to load image
                    </div>
                </>
            )}
        </div>
    )
}

export default ImageWithAwsHook;