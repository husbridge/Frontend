import { RxDownload } from "react-icons/rx"
import useAwsFile from "@hooks/useAwsFile";
import { Data as ChatData } from "type/api/messaging.types";

interface Props {
    newItem: ChatData;
    opened: boolean;
}

const DownloadFileButton = ({ newItem, opened }: Props) => {
    const { downloadFile } = useAwsFile({
        opened: opened,
        attachDocument: newItem.metadata.key
    });

    return (
        <div
            className="flex  items-center "
            onClick={downloadFile}
        >
            <RxDownload
                color="#D95B0E"
                size={22}
                style={{ marginRight: "5px" }}
            />
            <p className="cursor-pointer text-sm">Download</p>
        </div>
    );
}

export default DownloadFileButton;
