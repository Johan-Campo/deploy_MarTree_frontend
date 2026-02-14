export default function NotFoundView() {
    return (
        <div className="w-full px-10 mt-28 text-white">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-16">

                <div className="flex-1">
                    <h1 className="text-[120px] leading-none font-extrabold text-green-600 mb-6">
                        404
                    </h1>

                    <p className="text-3xl md:text-4xl font-light mb-10">
                        Oops!, Usuario no Encontrado
                    </p>

                    <a
                        href="/admin"
                        className="
        inline-block 
        px-8 py-4 
        text-lg font-semibold 
        text-white 
        rounded-xl 
        bg-[linear-gradient(60deg,_rgb(64,_180,_140),_rgb(72,_160,_200),_rgb(96,_140,_220),_rgb(110,_120,_210),_rgb(130,_110,_200),_rgb(150,_120,_210))]
        bg-[length:200%_200%]
        transition-all duration-500
        hover:scale-105
        hover:bg-[position:100%_0%]
        shadow-lg hover:shadow-2xl
    "
                    >
                        Volver al Perfil
                    </a>
                </div>

                <div className="flex-1 flex justify-center md:justify-end">
                    <img
                        src="https://user-images.githubusercontent.com/43953425/166269493-acd08ccb-4df3-4474-95c7-ad1034d3c070.svg"
                        alt="Page not found"
                        className="max-w-lg w-full"
                    />
                </div>

            </div>
        </div>
    )
}