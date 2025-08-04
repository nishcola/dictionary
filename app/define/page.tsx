"use client"
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react"; // Import Suspense

async function Definition() {
    const searchParams = useSearchParams();
    const query = searchParams.get('word');
    
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${query}`;
    const res = await fetch(url, {
        next: { revalidate: 3600 }
    });
    const info = await res.json();
    const { meanings } = info[0];

    return (
        <div>
            <h1 className="text-3xl">Definition for: {query}</h1>
        </div>
    );
}

export default function DefinitionPage() {
    return (
        <Suspense fallback={<div>Loading definition...</div>}>
            <Definition />
        </Suspense>
    );
}