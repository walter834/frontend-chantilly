'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();
    return (
        <header className="bg-[#c41c1a] ">
            <div className="overflow-x-auto gap-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 border-b border-gray-200 bg-[#c41c1a] shadow-lg cursor-pointer flex items-center justify-between" onClick={() => router.push('/')}>
                <div className="flex items-center justify-start">
                    <Image
                        src="/logo.png"
                        alt="logo"
                        width={350}
                        height={350}
                    />
                </div>
                <div className="flex items-center justify-end">
                    <h1 className="text-white text-[20px] font-semibold">
                        ¿Necesitas ayuda? Escríbenos al 955 122 100
                    </h1>
                </div>
            </div>
        </header>
    );
}