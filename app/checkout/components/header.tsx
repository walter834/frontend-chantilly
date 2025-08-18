import Image from 'next/image';

export default function Header() {
    return (
        <header className="bg-[#c41c1a] ">
            <div className="overflow-x-auto gap-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 border-b border-gray-200 bg-[#c41c1a] shadow-lg">
                <div className="flex flex justify-start pt-3">
                    <Image
                        src="/logo.png"
                        alt="logo"
                        width={350}
                        height={350}
                    />
                </div>
                <div className="flex justify-end">
                    <h1 className="text-white text-[20px] font-semibold">
                        ¿Necesitas ayuda? Escríbenos al 955 122 100
                    </h1>
                </div>
            </div>
        </header>
    );
}