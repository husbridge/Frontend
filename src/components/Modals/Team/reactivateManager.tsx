import { Modal } from "@mantine/core";
import Close from "@assets/icons/close.svg";
import { Button } from "@components/index";
import reactivate from "@assets/icons/reactivate.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showNotification } from "@mantine/notifications";
import { type Error } from "../../../type/api/index";
import { reactivateManager } from "@services/manager";

export interface ReactivateMangerModalProps {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>
  setOpenReactivatedModal: React.Dispatch<React.SetStateAction<boolean>>
  id: string;
}

const ReactivateManagerModal = ({ opened, setOpened, setOpenReactivatedModal,id, }: ReactivateMangerModalProps) => {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: reactivateManager,
    onSuccess: () => {
        setOpenReactivatedModal(true)
      setOpened(false);

      queryClient
        .invalidateQueries({
          queryKey: ["managers"],
        })
        .finally(() => false);
      queryClient
        .invalidateQueries({
          queryKey: ["singleManager"],
        })
        .finally(() => false);
    },
    onError: (err: Error) => {
      showNotification({
        title: "Error",
        message: err.response?.data?.message || err.message,
        color: "red",
      });
    },
  });
 return (
    <Modal
      opened={opened}
      withCloseButton={false}
      onClose={() => setOpened(false)}
      size="550px"
      centered
      radius={30}
      className="font-Montserrat"
      classNames={{
        body: "p-4 py-10",
      }}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <div className="flex justify-end mr-4">
        <img
          src={Close}
          alt=""
          className="cursor-pointer mb-2"
          onClick={() => setOpened(false)}
        />
      </div>

      <div className="flex flex-col items-center justify-center w-full">
        <img src={reactivate} alt="" />
        <br />

        <h1 className="font-semibold sm:text-[20px] text-3md mb-4 text-center mt-4">
          Reactivate Manager?
        </h1>
        <p className="font-medium text-md text-center">
          Are you sure you want to reactivate manager's account?
        </p>
      </div>
      <div 
      className="mt-12 flex sm:px-4 !font-semibold"
      onClick={() => setOpened(false)} 
       >
        <Button variant="clear" className="w-full !text-md !text-sm">
          Cancel
        </Button>

        <Button
          variant="black"
          className="ml-4 w-full !text-[#F6695E] !sm:text-md !text-sm"
          disabled={isPending}
          onClick={() => mutate({ managerId: id })}
        >
          {isPending ? "Reactivating..." : "Reactivate"}
        </Button>
      </div>
    </Modal>
  );
};

export default ReactivateManagerModal;