"use client";

import { Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactSection() {
    return (
        <section className="w-full bg-[#f3f3f3]">

            <div className="max-w-[1440px] mx-auto">
                <div className="relative px-6 py-20 md:px-16 md:py-28">

                    {/* <div className="absolute right-6 top-10 flex flex-col gap-4 md:right-16">
                        {[Facebook, Instagram, Twitter].map((Icon, i) => (
                            <div
                                key={i}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-white transition"
                            >
                                <Icon className="h-4 w-4" />
                            </div>
                        ))}
                    </div> */}

                    <div className="max-w-3xl">
                        <h2 className="text-3xl font-semibold leading-tight md:text-5xl">
                            Get in touch with us. <br />
                            We're here to assist you.
                        </h2>
                    </div>

                    <div className="mt-16 grid gap-8 md:grid-cols-3 max-w-5xl">
                        <input
                            placeholder="Your Name"
                            className="border-b border-gray-300 bg-transparent pb-3 text-sm outline-none placeholder:text-gray-500 focus:border-black transition"
                        />
                        <input
                            placeholder="Email Address"
                            className="border-b border-gray-300 bg-transparent pb-3 text-sm outline-none placeholder:text-gray-500 focus:border-black transition"
                        />
                        <input
                            placeholder="Phone Number"
                            required
                            className="border-b border-gray-300 bg-transparent pb-3 text-sm outline-none placeholder:text-gray-500 focus:border-black transition"
                        />
                    </div>

                    <div className="mt-10">
                        <Button className="rounded-full bg-[#63c132] px-8 py-6 text-sm font-semibold text-white shadow-md hover:bg-[#55aa2a]">
                            Leave us a Message
                        </Button>
                    </div>
                </div>

                <div className="bg-[#63c132] px-6 py-16 md:px-16">
                    <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">

                        <div className="max-w-md text-white">
                            <h3 className="text-2xl font-semibold">
                                Subscribe to our Newsletter
                            </h3>
                            <p className="mt-2 text-sm text-white/80 leading-relaxed">
                                Subscribe for updates. Stay informed about the latest investor
                                updates, financial results, and announcements.
                            </p>
                        </div>

                        <div className="flex w-full max-w-md overflow-hidden rounded-xl bg-white">
                            <input
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 text-sm outline-none"
                            />
                            <button className="bg-white px-6 text-sm font-medium text-[#63c132] hover:bg-gray-100 transition">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}