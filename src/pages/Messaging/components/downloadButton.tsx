import { RxDownload } from "react-icons/rx"
import { Data as ChatData } from "type/api/messaging.types";

interface Props {
    newItem: ChatData;
    opened: boolean;
}

const DownloadFileButton = ({ newItem }: Props) => {
    const downloadFile = () => {
      const path = newItem.metadata.url;
      // Create temporary link and trigger download
      const link = document.createElement("a");
      link.href = path;
      link.download = path.split("/").pop() || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    return (
        <div
        //   className="flex items-center gap-1 px-3 py-2  bg-gray-800 hover:bg-orange-100 rounded-lg cursor-pointer transition-colors duration-150 border border-orange-200"
          className="flex items-center gap-1 mb-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors duration-150 border border-gray-600"
          onClick={downloadFile}
        >
        <RxDownload
          className="text-orange-400"
          size={18}
        />
        <p className="text-white font-medium">Download</p>
        </div>
    );
}

export default DownloadFileButton;
