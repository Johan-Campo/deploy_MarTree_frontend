
import AdminNavigation from "./Nav/AdminNavigation";
import Logo from "./Logo";

export default function Header() {
    return (
        <header className="bg-black/60 py-5">
            <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center md:justify-between">
                <div className="w-full p-5 lg:p-0 md:w-1/3">
                   <Logo />
                </div>
                <div className="uppercase cursor-pointer flex justify-center md:flex md:justify-end font-medium">
                    <div className="group flex  flex-grow mt-4">
                        <a href="#"
                            className="flex flex-grow  justify-between rounded-lg overflow-hidden bg-gradient-to-r from-purple-600 to-teal-500 p-5 py-2 shadow-lg text-white group-hover:text-gray-600  transition-all duration-1000 ease-in-out relative z-30">
                            <div
                                className=" absolute  -top-0 left-0 w-5 h-0.5 group-hover:h-full group-hover:left-0 group-hover:w-1/2 bg-gray-900/20     z-10 transition-all duration-700 ease-in-out ">
                            </div>
                            <div
                                className=" absolute  -top-0 right-0 w-5 h-0.5 group-hover:h-full group-hover:right-0 group-hover:w-1/2 bg-gray-900/20     z-10 transition-all duration-700 ease-in-out ">
                            </div>
                            <AdminNavigation />
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}