'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function page() {
    const router = useRouter();
    const [loading,setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        router.push("/home");
    },[]);
    return (
        <>
        {loading && <div>Loading...</div>}
        </>
    );
}