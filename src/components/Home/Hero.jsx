import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-900 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:grid lg:grid-cols-2 items-center gap-12 w-full py-16 lg:min-h-[90vh]">

                {/* Left text */}
                <div className="space-y-6 z-10 text-center lg:text-left">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-blue-900">
                        Empowering Students Through Technology
                    </h1>
                    <p className="text-base sm:text-lg text-gray-700 max-w-xl mx-auto lg:mx-0">
                        The Computing Students Society unites learners, innovators, and
                        future leaders through hands-on workshops, hackathons, and
                        community-driven events.
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                        <Link
                            href="/events"
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 transition shadow-md"
                        >
                            Explore Events
                        </Link>
                        <Link
                            href="/join"
                            className="px-6 py-3 border border-blue-600 text-blue-700 rounded-xl font-medium hover:bg-blue-50 transition"
                        >
                            Join Us
                        </Link>
                    </div>
                </div>

                {/* Right side styled image */}
                <div className="relative w-full h-[40vh] sm:h-[50vh] lg:h-[80vh] flex justify-center">
                    <div className="relative w-full h-full max-w-lg">
                        <Image
                            src="/images/gallery/hero.jpg"
                            alt="Students collaborating at CSS event"
                            fill
                            priority
                            className="object-cover object-center rounded-2xl shadow-2xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
