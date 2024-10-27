'use client'

import { useState, useEffect } from 'react'
import { useUser } from "@clerk/nextjs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CostumeCarousel } from "@/components/CostumeCarousel";

interface Costume {
    id: string
    url: string
    pathname: string
}

export default function VotePage() {
    const [costumes, setCostumes] = useState<Costume[]>([])
    const [error, setError] = useState<string | null>(null)
    const { isSignedIn } = useUser()

    useEffect(() => {
        async function fetchCostumes() {
            try {
                const response = await fetch("/api/avatar/getImages")
                if (!response.ok) {
                    throw new Error('Failed to fetch images')
                }
                const data = await response.json()
                setCostumes(data.blobs.map((blob: any) => ({
                    id: blob.pathname,
                    url: blob.url,
                    pathname: blob.pathname
                })))
            } catch (err) {
                setError('Failed to load images. Please try again later.')
                console.error('Error fetching images:', err)
            }
        }

        fetchCostumes()
    }, [])

    const handleVote = async (costumeId: string, category: string) => {
        if (!isSignedIn) {
            alert('Please sign in to vote!')
            return
        }

        try {
            const response = await fetch('/api/votes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ costumeId, category }),
            })

            if (!response.ok) {
                throw new Error('Failed to submit vote')
            }

            alert('Vote submitted successfully!')
        } catch (error) {
            console.error('Error submitting vote:', error)
            alert('Failed to submit vote. Please try again.')
        }
    }

    if (error) {
        return <div className="text-red-500">{error}</div>
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Vote for the Best Costumes</h1>
            <Tabs defaultValue="best">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                    <TabsTrigger value="best">Best Costume</TabsTrigger>
                    <TabsTrigger value="funniest">Funniest Costume</TabsTrigger>
                    <TabsTrigger value="creative">Most Creative Costume</TabsTrigger>
                    <TabsTrigger value="worst">Worst Costume</TabsTrigger>
                </TabsList>
                <TabsContent value="best">
                    <CostumeCarousel costumes={costumes} category="best" onVote={handleVote} />
                </TabsContent>
                <TabsContent value="funniest">
                    <CostumeCarousel costumes={costumes} category="funniest" onVote={handleVote} />
                </TabsContent>
                <TabsContent value="creative">
                    <CostumeCarousel costumes={costumes} category="creative" onVote={handleVote} />
                </TabsContent>
                <TabsContent value="worst">
                    <CostumeCarousel costumes={costumes} category="worst" onVote={handleVote} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
