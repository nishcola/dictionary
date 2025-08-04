"use client"
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react"; // Import Suspense
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DefinitionPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('word');
    const [data, setData] = useState([]);

    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${query}`;

    useEffect(() => {
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setData(data)
            })
    }, [url]);

    let meanings = [];
    let word = query; // Default to query if data[0] is not available yet
    let origin = '';
    let phoneticText = '';

    if (data && data.length > 0) {
        ({ meanings, word, origin, phonetic: phoneticText } = data[0]);
    }

    return (
        <div className="p-5">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">Definitions for: {query}</h1>
            
            {phoneticText && (
                <p className="text-xl text-gray-600 mb-4">{phoneticText}</p>
            )}

            {origin && (
                <p className="text-md text-gray-700 italic mb-6">Origin: {origin}</p>
            )}

            {meanings && meanings.length > 0 ? (
                <div>
                    {meanings.map((meaning, meaningIndex) => (
                        <div key={meaningIndex} className="mt-6 p-4 border rounded-md bg-white">
                            <h2 className="text-2xl font-bold text-blue-600 capitalize">{meaning.partOfSpeech}</h2>

                            {/* Loop through definitions for each part of speech */}
                            {meaning.definitions && meaning.definitions.length > 0 && (
                                <ol className="list-decimal list-inside ml-4 mt-2">
                                     {meaning.definitions.map((def, defIndex) => (
                                        <li key={defIndex} className="mb-3">
                                            <p className="font-medium text-gray-800">{def.definition}</p>

                                            {/* Example */}
                                            {def.example && (
                                                <p className="text-sm text-gray-600 italic mt-1">
                                                    Example: "{def.example}"
                                                </p>
                                            )}

                                            {/* Synonyms */}
                                            {def.synonyms && def.synonyms.length > 0 && (
                                                <p className="text-sm text-green-700 mt-1">
                                                    Synonyms: {def.synonyms.join(', ')}
                                                </p>
                                            )}

                                            {/* Antonyms */}
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
                // This will show if data is still loading or if no meanings were found
                <div className="mt-4 text-center text-gray-600">
                    {data.length === 0 ? "Loading definition..." : "No definitions found for this word."}
                </div>
            )}
        </div>
    );
}