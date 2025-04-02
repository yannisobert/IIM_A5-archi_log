"use client"

import {useState} from "react";
import dynamic from "next/dynamic"
// This component will be rendered on the client side
const MapContent = dynamic(() => import("@/components/map/map-view"), { ssr: false })
import ListView from "@/components/map/list-view"
import ViewSwitcher from "@/components/map/view-switcher"
import Image from "next/image"
import {useMediaQuery} from "@/hooks/use-media-query"
import {Location} from "@/index"
import AddPeeButton from "@/components/map/add-pee-button";


export default function PeeMap() {

    const [currentView, setCurrentView] = useState<"map" | "list">("map")
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

    // Check if we're on mobile
    const isMobile = useMediaQuery("(max-width: 768px)")

    const handleLocationSelect = (location: Location) => {
        setSelectedLocation(location)
        // On mobile, switch to map view when a location is selected
        if (isMobile) {
            setCurrentView("map")
        }
    }

    // Sample location data - you can replace this with your actual data
    const [locations, setLocations] = useState<Location[]>([
        {
            id: 1,
            name: "Point A",
            lat: 51.505,
            lng: -0.09,
            description: "This is point A with some details about the location.",
        },
        {
            id: 2,
            name: "Point B",
            lat: 51.51,
            lng: -0.1,
            description: "This is point B with information about what can be found here.",
        },
        {
            id: 3,
            name: "Point C",
            lat: 51.515,
            lng: -0.08,
            description: "This is point C with a description of this interesting place.",
        },
        { id: 4, name: "Point D", lat: 51.52, lng: -0.12, description: "This is point D, a notable landmark in the area." },
        {
            id: 5,
            name: "Point E",
            lat: 51.498,
            lng: -0.05,
            description: "This is point E, worth visiting for its unique features.",
        },
    ])

    const handleAddPee = (newPin: Omit<Location, "id">) => {
        // Generate a new ID (in a real app with Prisma, this would be handled by the database)
        const newId = Math.max(0, ...locations.map((loc) => loc.id)) + 1

        // Add the new pin to the locations array
        const newLocation: Location = {
            id: newId,
            ...newPin,
        }

        setLocations((prev) => [...prev, newLocation])

        // Select the new location and switch to map view
        setSelectedLocation(newLocation)
        setCurrentView("map")

        // In the future, this is where you would call a server action to save to Prisma
        console.log("New pin to be saved to database:", newLocation)
    }

    return (
        <main className="flex min-h-screen flex-col">
            {/* Header - visible on desktop */}
            <header className="hidden md:flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                    <Image
                        width={100}
                        height={100}
                        src="/logo.svg"
                        alt="PeeMap logo"
                        className="w-6 h-6"
                    />
                    <h1 className="text-2xl font-bold">PeeMap</h1>
                </div>
                <ViewSwitcher currentView={currentView} onViewChange={setCurrentView}/>
            </header>

            {/* Main content */}
            <div className="flex-1 relative">
                <div
                    className={`absolute inset-0 transition-opacity duration-300 ${currentView === "map" ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                >
                    <MapContent locations={locations} selectedLocation={selectedLocation}/>
                </div>
                <div
                    className={`absolute inset-0 transition-opacity duration-300 ${currentView === "list" ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                >
                    <ListView locations={locations} onSelectLocation={handleLocationSelect}/>
                </div>

                <div className="absolute bottom-20 right-4 md:bottom-4 md:right-4 z-20">
                    <AddPeeButton onAddPee={handleAddPee}/>
                </div>

            </div>

            {/* Bottom bar - visible on mobile */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex justify-center z-20">
                <ViewSwitcher currentView={currentView} onViewChange={setCurrentView}/>
            </div>
        </main>
    )
}
