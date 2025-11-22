import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useLogout } from "../hooks/useAuth";
import { useUserStore } from "../store/user.store"
import type { User } from "../types/user.types";

const Header = () => {
    const user: User | null = useUserStore(state => state.user);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // initials logic
    const nameArr = user ? user.name.split(" ") : [];
    const initials = nameArr.length > 0
        ? (nameArr[0][0] + (nameArr.length > 1 ? nameArr[1][0] : '')).toUpperCase()
        : '?';


    const { mutate: logoutMutate } = useLogout();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    return (
        <header className="w-full h-16 bg-white border-b border-neutral-200 flex items-center justify-end px-6">
            <div className="flex items-center gap-6">

                {/* add a product */}
                <Link to="/create">
                    <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-sm hover:bg-neutral-800 transition-colors duration-200 cursor-pointer">
                        Add Product
                    </button>
                </Link>

                {/* User Profile Container */}
                <div className="relative z-50" ref={dropdownRef}>

                    {/* Avatar Trigger */}
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-10 h-10 bg-black rounded-sm flex items-center justify-center cursor-pointer hover:bg-neutral-800 transition-colors"
                    >
                        <span className="text-white font-semibold text-sm tracking-wider">
                            {initials}
                        </span>
                    </button>

                    {/* Dropdown  */}
                    <div className={`absolute right-0 mt-2 w-48 bg-white rounded-sm border border-neutral-200 shadow-lg transition-all duration-200 transform origin-top-right ${
                        dropdownOpen 
                            ? 'opacity-100 visible scale-100' 
                            : 'opacity-0 invisible scale-95'
                    }`}>
                        <div className="p-4 border-b border-neutral-200">
                            <p className="text-sm font-bold text-black tracking-tight truncate">
                                {user ? user.name : 'Guest'}
                            </p>
                            <p className="text-xs text-neutral-600 uppercase tracking-wide mt-1">
                                {user ? user.role : 'Visitor'}
                            </p>
                        </div>
                        <button
                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                            onClick={() => logoutMutate()}
                        >
                            Logout
                        </button>
                    </div>

                </div>
            </div>
        </header>
    )
}

export default Header