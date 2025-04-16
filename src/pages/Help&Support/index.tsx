import { Layout, Input } from "@components/index"
import { CiSearch } from "react-icons/ci"
import Question from "@assets/icons/question.svg"
import Price from "@assets/icons/price.svg"
import Video from "@assets/icons/video.svg"


const HelpSupport = () => {
    

    return (
        <Layout pageTitle="Help&Support">
            <div className=" pt-28 h-screen text-black-100 bg-[#FBFBFB]">
            
            <p className="text-[20px] md:text-[24px] font-medium px-2 leading-6 mt-2">
                    Help & Support
                </p>


                <div className="mt-7">
                    <p className="text-[24px] md:text-[35px] lg:text-[24px] font-medium text-[#101214]
                    text-center">
                        How can we help?
                    </p>    
                </div>

                <div className="flex justify-center mt-6">
                    <Input
                        placeholder="Search for the answer to your concern"
                        className=" border border-black-100 rounded-full w-[80%] xl:w-[600px] p-4 h-[70px] md:text-[20px] text-grey-100 font-medium ml-4"
                        prefixIcon={
                            <CiSearch
                                size="30px"
                                color="#1012149" 
                                className="mr-2"
                            />
                        }
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-14 ml-10 lg:ml-28 justify-center">

                <div className="flex items-start">
                    <img src={Question} style={{ width: '40px', height: 'auto' }} className="mr-2"/>

                    <div className="bg-white">
                    <h2 className="text-[16px] leading-5 font-semibold mb-2">Frequently Asked Questions</h2>
                <p className="text-[#000000] font-normal text-[10px] leading-5 mb-4 max-w-[200px]  line-clamp-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum.
            </p>
                    <a href="#" className="text-[#475569] font-semibold">See FAQs &rarr;</a>
                </div>      
                </div>

                
                    <div className="flex items-start">
                    <img src={Price} style={{ width: '40px', height: 'auto' }} className="mr-2"/>
                    <div className="bg-white">
                    <h2 className="text-[16px] leading-5 font-semibold mb-2">Pricing</h2>
                    <p className="text-[#000000] font-normal text-[10px] leading-5 mb-4 max-w-[200px]  line-clamp-3">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum.
                    </p>
                    <a href="#" className="text-[#475569] font-semibold">See Pricing List &rarr;</a>
                </div>
                    </div>


                        <div className="flex items-start">
                        <img src={Question} style={{ width: '40px', height: 'auto' }} className="mr-2"/>

                        <div className="">
                    <h2 className="text-[16px] leading-5 font-semibold mb-2">Customer Care Center</h2>
                    <p className="text-[#000000] font-normal text-[10px] leading-5 mb-4 max-w-[200px] line-clamp-3">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum.
                    </p>
                    <a href="#" className="text-[#475569] font-semibold">Reach Out &rarr;</a>
                </div>
                        </div>



                        <div className="flex items-start mt-3">
                        <img src={Video} style={{ width: '40px', height: 'auto' }} className="mr-2"/>
                        <div className="">
                    <h2 className="text-[16px] leading-5 font-semibold mb-2">How-to Video</h2>
                    <p className="text-[#000000] font-normal text-[10px] leading-5 mb-4 max-w-[200px] line-clamp-3">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum.
                    </p>
                    <a href="#" className="text-[#475569] font-semibold">See Videos &rarr;</a>
                </div>

                 </div>
                 </div>
     
            </div>
        </Layout>
    )
}

export default HelpSupport
