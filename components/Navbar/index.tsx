import { ShoppingCart, User } from 'lucide-react';
import NavToggle from './nav-toggle';
import NavLinks from './nav-links';

export default function Navbar() {
    return (
        <header className='w-full'>
            <div className='flex justify-between'>
                <div className='md:hidden'>
                    <NavToggle />
                </div>

                <div className='flex w-full justify-between'>
                    <nav className='hidden md:block'>
                        <ul>
                            <NavLinks />
                        </ul>
                    </nav> 
                    <div className='flex gap-2 items-center'>
                        <User size={24} />
                        <ShoppingCart size={24} />
                    </div>
                </div>
            </div>

        </header>
    )
}
