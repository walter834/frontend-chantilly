import { ShoppingCart, User } from "lucide-react";
import NavLinks from "./nav-links";
import NavToggle from "./nav-toggle";

export default function Navbar() {
  return (
    <header className="fixed bg-[#c41d1ada] text-white top-0 z-50 flex justify-between items-center px-5 lg:px-10 py-4 w-full lg:min-w-[950px]">
      <div className="lg:flex hidden gap-4 ">
        <h1>LOGO</h1>
      </div>
      <div className="lg:flex hidden lg:gap-6">
        <nav className="flex flex-row">
          <ul className="flex flex-row gap-4">
            <NavLinks />
          </ul>
        </nav>
      </div>

      <div className="lg:flex hidden gap-4 ">
        <User size={26}/>
        <ShoppingCart size={26}/>
      </div>

      <div className="flex justify-between  w-full items-center lg:hidden">
        <NavToggle />

        <div className="flex gap-4 items-center">
          <User size={26}/>
          <ShoppingCart size={26}/>
        </div>
      </div>
    </header>
  );
}
