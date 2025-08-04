"use client"
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Definition {
    definition: string;
    example?: string;
    synonyms: string[];
    antonyms: string[];
}

interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
}

interface WordData {
    word: string;
    phonetic?: string;
    phonetics: { text: string; audio?: string }[];
    origin?: string;
    meanings: Meaning[];
}

interface ErrorResponse {
    title: string;
    message: string;
    resolution: string;
}

function Definition() {
    const searchParams = useSearchParams();
    const query = searchParams.get('word');
    // Initialize data to null and add a loading state
    const [data, setData] = useState<WordData[] | ErrorResponse[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${query}`;

    useEffect(() => {
        if (!query) {
            setIsLoading(false);
            setData(null);
            return;
        }

        setIsLoading(true); // Set loading to true before fetching
        setData(null); // Clear previous data

        fetch(url)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Word not found or API error.');
                }
                return res.json();
            })
            .then((fetchedData) => {
                setData(fetchedData);
                setIsLoading(false); // Set loading to false after successful fetch
            })
            .catch((error) => {
                console.error("Fetch error: ", error);
                setData(null); // Clear data on error
                setIsLoading(false); // Set loading to false on error
            });
    }, [url, query]);

    // Handle loading state
    if (isLoading) {
        return <div className="p-5 text-center">Loading...</div>;
    }

    // Handle no data found
    if (!data || data.length === 0 || 'title' in data[0]) {
        return <div className="p-5 text-center">No definitions found for "{query}".</div>;
    }

    // Now it's safe to destructure the data
    const wordData = data[0] as WordData;
    const { word, meanings, origin, phonetic: phoneticText } = wordData;

    return (
        <div className="p-5">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">Definitions for: {word || query}</h1>
            
            {phoneticText && (
                <Badge className="bg-blue-500 text-white dark:bg-blue-600 mb-2">{phoneticText}</Badge>
            )}

            {origin && (
                <p className="text-md text-gray-700 italic mb-2">Origin: {origin}</p>
            )}

            {meanings && meanings.length > 0 ? (
                <div>
                    {meanings.map((meaning, meaningIndex) => (
                        <div key={meaningIndex} className="mt-6 p-4 border rounded-md bg-white">
                            <h2 className="text-2xl font-bold text-blue-600 capitalize">{meaning.partOfSpeech}</h2>

                            {meaning.definitions && meaning.definitions.length > 0 && (
                                <ol className="list-decimal list-inside ml-4 mt-2">
                                     {meaning.definitions.map((def, defIndex) => (
                                        <li key={defIndex} className="mb-3">
                                            <p className="font-medium text-gray-800">{def.definition}</p>

                                            {def.example && (
                                                <p className="text-sm text-gray-600 italic mt-1">
                                                    Example: {def.example}
                                                </p>
                                            )}

                                            {def.synonyms && def.synonyms.length > 0 && (
                                                <p className="text-sm text-green-700 mt-1">
                                                    Synonyms: {def.synonyms.join(', ')}
                                                </p>
                                            )}

                                            {def.antonyms && def.antonyms.length > 0 && (
                                                <p className="text-sm text-red-700 mt-1">
                                                    Antonyms: {def.antonyms.join(', ')}
                                                </p>
                                            )}
                                        </li>
                                    ))}
                                </ol>
                            )}
                             {!meaning.definitions || meaning.definitions.length === 0 && (
                                <p className="text-gray-500 italic">No definitions available for this part of speech.</p>
                            )}
                        </div>
                    ))}

                    <div className="mt-6">
                        <Button className="bg-blue-600 rounded">
                            <Link href="\">Return Home</Link>
                        </Button>
                    </div>
                    <div className="mt-6 flex flex-row gap-3">
                        <span>&#9432;</span>
                        <span className="italic">Information may vary depending on API availability</span>
                    </div>
                </div>
            ) : (
                <div className="mt-4 text-center text-gray-600">
                    No definitions found for this word.
                </div>
            )}
        </div>
    );
}

export default function DefinitionPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
          <Definition />
        </Suspense>
    );
}