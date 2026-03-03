'use client'

import { useState, useEffect } from "react";
import { fetchAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Star, ChevronRight } from "lucide-react";

export default function FeaturedExperts() {
    const [experts, setExperts] = useState([]);
    const { isAuthenticated, openLoginModal } = useAuth();
    const router = useRouter();

    const handleExpertClick = (expert) => {
        const id = expert._id;
        if (!id) return;

        if (!isAuthenticated) {
            openLoginModal();
        } else {
            router.push(`/experts/${id}`);
        }
    };

    useEffect(() => {
        async function fetchTopRatedExperts() {
            try {
                const data = await fetchAPI('/experts/listing/home/top-rated');
                console.log('topRatedExperts', data);
                setExperts(Array.isArray(data?.items) ? data.items.slice(0, 5) : []);
            } catch (error) {
                console.log(error);
                setExperts([]);
            }
        }
        fetchTopRatedExperts();
    }, []);

    return (
        <section className="bg-white py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Top Rated Experts
                    </h2>
                    <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed">
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-10">
                    {experts?.map((expert, index) => (
                        <div
                            key={index}
                            onClick={() => handleExpertClick(expert)}
                            className="group cursor-pointer flex flex-col"
                        >
                            <div className="w-full aspect-[1/1.1] rounded-lg mb-4 overflow-hidden bg-gray-100">
                                <img
                                    src={expert?.profilePhoto || "/images/coach.png"}
                                    alt={expert?.coach?.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => { e.target.src = "/images/coach.png" }}
                                />
                            </div>

                            <div className="space-y-1">
                                <h3 className="font-bold text-lg text-gray-900 leading-tight">
                                    {expert?.coach?.name}
                                </h3>
                                <p className="text-gray-500 text-sm font-medium capitalize">
                                    {expert?.expertDetails?.title || expert?.specializations?.[0] || "Health Coach"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 flex justify-center">
                    <button
                        onClick={() => router.push('/experts')}
                        className="w-full sm:w-auto min-w-[300px] bg-[#f0f0f0] hover:bg-[#e8e8e8] text-[#84cc16] px-12 py-4 rounded-lg font-bold text-base transition-colors"
                    >
                        View all Experts
                    </button>
                </div>
            </div>
        </section>
    );
}

