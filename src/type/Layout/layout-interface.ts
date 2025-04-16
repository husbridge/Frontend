import { ReactNode } from "react"
import { Dispatch, SetStateAction } from "react";


export interface NavBarInterface {
    pageTitle?: string;
    setOpenSideBar: Dispatch<SetStateAction<boolean>>;
    search?: boolean
    
}

export interface LayoutProps {
    pageTitle?: string
    children: ReactNode
    search?:boolean 
    noTopNav?: boolean
    totalNumber?: number
}
