'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Costume {
    id: string
    url: string
    pathname: string
}

interface CostumeCarouselProps {
    costumes: Costume[]
    category: 'best' | 'funniest' | 'creative' | 'worst'
    onVote: (costumeId: string, category: string) => Promise<void>
}

export function CostumeCarousel({ costumes, category, onVote }: CostumeCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const { isSignedIn, user } = useUser()

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % costumes.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + costumes.length) % costumes.length)
    }

    const handleVote = async () => {
        if (isSignedIn && user) {
            await onVote(costumes[currentIndex].id, category)
        } else {
            alert('Please sign in to vote!')
        }
    }

    if (costumes.length === 0) {
        return <p>No costumes available for this category.</p>
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-6">
                <div className="relative aspect-square">
                    <Image
                        src={costumes[currentIndex].url}
                        alt={`Costume ${costumes[currentIndex].pathname}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                    />
                </div>
                <div className="flex justify-between items-center mt-4">
                    <Button variant="outline" onClick={prevSlide}>
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <Button variant="outline" onClick={nextSlide}>
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <Button
                    onClick={handleVote}
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={!isSignedIn}
                >
                    Vote for this costume
                </Button>
            </CardContent>
        </Card>
    )
}
