"use client"
import { useAuthStore } from "@/store/Auth";
import React from "react";
import { useRouter } from "next/router";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const {session} = useAuthStore();
    const router = useRouter();

    React.useEffect(() => {
        if(!session) {
            router.push("/login")
        }
    }, [session, router])
    
    if (session) {
        return null
    }

    return(
        <div className="">
            <div className="">{children}</div>
        </div>
    )
}