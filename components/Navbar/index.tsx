"use client";
import NavLinks from "./nav-links";
import NavToggle from "./nav-toggle";
import Image from "next/image";
import LoginForm from "../LoginForm";
import { useAuth } from "@/hooks/useAuth";
import Shopping from "../Shopping";

export default function Navbar() {
  const { name, isAuthenticated, logoutUser } = useAuth();
  return (
    //fix
    <header className="sticky overflow-x-hidden bg-[#c41d1ada] backdrop-blur-3xl text-white top-0 z-50 flex justify-between items-center px-5 lg:px-10 py-4 w-full lg:min-w-[1024px] gap-12">
      <div className="hidden xl:flex">
        <Image
          src="/logo.png"
          alt="logo"
          width={180}
          height={60}
          className="max-w-[180px]"
        />
      </div>
      <div className="lg:flex hidden lg:gap-6">
        <nav className="flex flex-row">
          <ul className="flex flex-row gap-4 items-center text-center">
            <NavLinks />
          </ul>
        </nav>
      </div>

      <div className="lg:flex hidden gap-4 ">
        {isAuthenticated ? <h1>{name}</h1> : <LoginForm />}

        <Shopping />
      </div>

      <div className="flex justify-between  w-full items-center lg:hidden">
        <NavToggle />

        <div className="flex gap-1 items-center">
          <LoginForm />
          <Shopping />
        </div>
      </div>
    </header>
  );
}
