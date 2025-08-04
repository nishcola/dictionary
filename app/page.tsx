"use client"
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [ query, setQuery ] = useState('');
  
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('word', query);
    router.push(`/define?${params.toString()}`);
  }

  return (
    <main className="flex flex-col min-h-screen ">
      <div className="flex-grow flex flex-col justify-center items-center">
        <div className="title text-center p-3">
          <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">Dictionary</h1>
        </div>
        <div className="body text-center p-5">
          <form onSubmit={handleSubmit} className="flex flex-row gap-3">
            <Input type="text" placeholder="Enter a word..." value={query} onChange={(e) => setQuery(e.target.value)}></Input>
            <Button type="submit" className="bg-blue-600 rounded">Define it!</Button>
          </form>
        </div>
      </div>
      <footer className="bg-gray-200 w-full p-5 text-center">
        <p>&#9432; Dictionary data and API provided by dictionaryapi</p>
      </footer>
    </main>
  );
}
