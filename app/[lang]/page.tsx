import ScrollProgress from "@/components/layout/scroll-progress";
import Hero from "@/components/sections/hero";


export default function Home() {
    return (
        <>
            <ScrollProgress />

            <main className="bg-background relative">
                <Hero />
            </main>
        </>
    )
}