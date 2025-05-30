import { useState } from "react";
import useAwsFile from "@hooks/useAwsFile";
import { Data as ChatData } from "type/api/messaging.types";

interface Props {
    newItem: ChatData;
}

const ImageWithAwsHook = ({ newItem }: Props) => {
    const { fileProperties } = useAwsFile({
        opened: true,
        attachDocument: newItem.metadata.key
    });

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

    const imageUrl = fileProperties?.url || newItem.metadata.url;

    return (
        <div className="space-y-2">
            <img
                src={imageUrl}
                alt="Shared image"
                className="max-w-full h-auto rounded-lg max-h-64 object-contain"
                onError={handleImageError}
            />
            <div className="hidden text-red-500 text-xs">
                Failed to load image
            </div>
        </div>
    )
}

export default ImageWithAwsHook;