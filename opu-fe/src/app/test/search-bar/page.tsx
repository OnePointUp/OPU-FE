"use client";
import SearchBar from "@/components/common/SearchBar";

export default function SearchBarTest() {
    return (
        <div className="flex flex-col items-center min-h-screen">
            <h1 className="mt-10 mb-6 text-xl font-semibold text-zinc-800">
                SearchBar Test Page
            </h1>
            <div className="flex justify-center w-full">
                <SearchBar />
            </div>
        </div>
    );
}
