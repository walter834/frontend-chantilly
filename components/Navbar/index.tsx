"use client";
import NavLinks from "./nav-links";
import NavToggle from "./nav-toggle";
import Image from "next/image";
import LoginForm from "../LoginForm";
import { useAuth } from "@/hooks/useAuth";
import Shopping from "../Shopping";
import UserDrop from "../UserDrop";
import Link from "next/link";

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  return (
    //fix
    <header className="sticky overflow-x-hidden bg-[#c41d1ada] backdrop-blur-3xl text-white top-0 z-50 flex justify-between items-center px-5 lg:px-10 py-4 w-full lg:min-w-[1024px] gap-12">
      <div className="hidden xl:flex">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="logo"
            width={320}
            height={45}
            className="max-w-[320px]"
          />
        </Link>
      </div>
      <div className="lg:flex hidden lg:gap-6">
        <nav className="flex flex-row">
          <ul className="flex flex-row gap-4 items-center text-center">
            <NavLinks />
          </ul>
        </nav>
      </div>

      <div className="lg:flex hidden gap-4 ">
        {isAuthenticated ? <UserDrop /> : <LoginForm />}

        <Shopping showCount={true} isPrimary={true} />
      </div>

      <div className="flex justify-between  w-full items-center lg:hidden">
        <NavToggle />

        <div className="flex gap-1 items-center">
          {isAuthenticated ? <UserDrop /> : <LoginForm />}
          <Shopping showCount={true} isPrimary={false} />
        </div>
      </div>
    </header>
  );
}
