"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Costume {
    url: string;
    id: string;
}

export default function ImageGallery() {
    const [images, setImages] = useState<Costume[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchImages() {
            try {
                const response = await fetch("/api/getCostumes");
                if (!response.ok) throw new Error("Failed to fetch images");

                const data = await response.json();
                setImages(data.costumes || []);
            } catch (err) {
                setError("Failed to load images.");
                console.error("Error fetching images:", err);
            }
        }
        fetchImages();
    }, []);

    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
                <div key={image.id} className="relative aspect-square">
                    <Image src={image.url} alt={`Costume ${image.id}`} layout="fill" objectFit="cover" className="rounded-lg" />
                </div>
            ))}
        </div>
    );
}
