import { useLogout } from "../hooks/useAuth";
import { useUserStore } from "../store/user.store"
import type { User } from "../types/user.types";

const Header = () => {
    const user: User | null = useUserStore(state => state.user);

    // initials logic
    const nameArr = user ? user.name.split(" ") : [];
    const initials = nameArr.length > 0
        ? (nameArr[0][0] + (nameArr.length > 1 ? nameArr[1][0] : '')).toUpperCase()
        : '?';


    const { mutate: logoutMutate } = useLogout();

    return (
        <header className="w-full h-16 bg-white border-b border-neutral-200 flex items-center justify-end px-6">
            <div className="flex items-center gap-6">

                {/* Logout Button */}
                <button
                    className="text-sm font-medium text-neutral-600 hover:text-black hover:underline transition-colors duration-200 cursor-pointer"
                    onClick={() => logoutMutate()}
                >
                    Logout
                </button>

                {/* User Profile Container */}
                <div className="relative group z-50">

                    {/* Avatar Trigger */}
                    <div className="w-10 h-10 bg-black rounded-sm flex items-center justify-center cursor-pointer hover:bg-neutral-800 transition-colors">
                        <span className="text-white font-semibold text-sm tracking-wider">
                            {initials}
                        </span>
                    </div>

                    {/* Dropdown  */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-sm border border-neutral-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                        <div className="p-4">
                            <p className="text-sm font-bold text-black tracking-tight truncate">
                                {user ? user.name : 'Guest'}
                            </p>
                            <p className="text-xs text-neutral-600 uppercase tracking-wide mt-1">
                                {user ? user.role : 'Visitor'}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </header>
    )
}

export default Header