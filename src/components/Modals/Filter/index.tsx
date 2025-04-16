import { Button, Modal } from "@mantine/core"
import Close from "@assets/icons/close.svg"
import { ReactNode } from "react"

export interface FilterModalProps {
    opened: boolean
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
    children: ReactNode
    applyFilters: () => void
    clearFilters: () => void
}

const FilterModal = ({
    opened,
    setOpened,
    children,
    applyFilters,
    clearFilters,

}: FilterModalProps) => {

  return (
    <Modal
        opened={opened}
        withCloseButton={false}
        onClose={() => setOpened(false)}
        size="lg"
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
          <div className="sm:px-4 text-md text-[#050505]">
            <div className="flex mb-6 items-center">
                <p className="text-[20px] font-semibold flex-1 text-center">
                Filter
                </p>
                <img
                    src={Close}
                    alt=""
                    className="flex-none cursor-pointer"
                    onClick={() => setOpened(false)}
                />
            </div>
            {children}
            <div className="flex justify-end items-center gap-3 mt-4">

                <Button
                    variant="clear"
                    className="!text-md text-black-60 mt-2 w-24 border-black-30 rounded-full"
                    onClick={() => {
                        clearFilters(); 
                        setOpened(false)
                    }}
                >
                    Clear
                </Button>
                <Button
                    variant="primary"
                    className="!text-md mt-2 w-24 rounded-full text-black-100 bg-yellow-100"
                    onClick={() => {
                        applyFilters(); 
                        setOpened(false)
                    }}
                >
                    Done
                </Button>

            </div>
          </div>
    </Modal>
    )
}

export default FilterModal




            
        //           <div className="flex flex-wrap gap-4 mt-2 md:flex-row">
        //           <div className="!text-md border rounded-full px-6 py-3">

        //             <div className="flex">
        //             <Radio
        //             color="#292D32"
        //             className="mr-2"
        //         />{" "}
        //         All
        //                  </div>   
        //     </div>
                //             <div className="!text-md ml-4 border rounded-full px-6 py-3">
                //             <div className="flex">
                //             <Radio
                //             color="#292D32"
                //             className="mr-2"
                //             onClick={() => {}}
                //         />{" "}
                //         Today
                //             </div>
                        
                //     </div>
                //         <div className="!text-md border rounded-full px-6 py-3">
                //             <div className="flex">
                //             <Radio
                //             color="#292D32"
                //             className="mr-2"
                //             onClick={() => {}}
                //         />{" "}
                //         Yesterday
                //             </div>
                       
                //     </div>
                    
                //     <div className="!text-md mt-2 border rounded-full px-6 py-3">
                //             <div className="flex"> 
                //             <Radio
                //             color="#292D32"
                //             className="mr-2"
                //             onClick={() => {}}
                //         />{" "}
                //         7days
                //             </div>
                        
                //     </div>
                //     <div className="!text-md mt-2 border rounded-full px-6 py-3">
                //             <div className="flex"> 
                //             <Radio
                //             color="#292D32"
                //             className="mr-2"
                //             onClick={() => {}}
                //         />{" "}
                //         30days
                //             </div>
                        
                //     </div>
                // </div>
        //         <p className="font-semibold text-[16px] leading-6 mt-4">Name</p>
        //         <div>
        //         <Input
        //              placeholder="Type first 3 letters"
        //            className=" mt-2 border border-[#E0E0E0] rounded-2xl w-[100%] p-4 text-[12px] text-grey-100 font-medium"/>

        //         </div>
        //         <div className="mt-4 flex w-full space-x-4">
        //         <Button
        //                 variant="clear"
        //                 className="!text-md mt-2 w-[50%] border-[#FFC107]">
        //                {" "}
        //                 Cancel
        //             </Button>

        //             <Button
        //                 variant="primary"
        //                 className="!text-md mt-2 w-[50%]">
        //                {" "}
        //                 Apply Filters
        //             </Button>
        //    </div>