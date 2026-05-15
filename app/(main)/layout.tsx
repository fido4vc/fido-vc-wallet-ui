"use client";
import Header from "@/components/Header";
import { isAuthenticated, getUser, getWalletId, setUser } from "@/lib/storage";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/login");
            return;
        }
    }, [router]);

    return <>
        <Header/>
        <div className="max-w-screen-xl mx-auto">{children}</div>
    </>;
}