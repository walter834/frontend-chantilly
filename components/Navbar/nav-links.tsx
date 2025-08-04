"use client";
import Link from "next/link";
import data from "./data";

export default function NavLinks() {
  const { routes, pathname } = data();

  return routes.map((item) => {
    return (
      <div key={item.id}>
        <Link
          href={item.link}
          className={`${
            pathname === item.link
              ? " text-yellow-300 lg:bg-transparent outline-yellow-300 outline-2 "
              : " hover:outline-yellow-300 hover:outline-2 hover:text-yellow-300"
          } flex items-center rounded-sm  px-2 py-4  text-sm  font-semibold  transition-all duration-100 ease-in-out `}
        >
          {item.title}
        </Link>
      </div>
    );
  });
}
