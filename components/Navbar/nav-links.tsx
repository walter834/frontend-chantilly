"use client"

import React from 'react'
import { itemsNavbar } from './data'
import { usePathname } from 'next/navigation'
import Link from 'next/link';

export default function NavLinks() {

  const router = usePathname();

  return (
    <div >
      {itemsNavbar.map((item)=>(
        <div key={item.id} className={`${router === item.link && "text-white bg-primary"} flex p-4  `}>
          <Link href={item.link}>{item.title}</Link>
        </div>
      ))}
    </div>
  )
}
