import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../store/user.store";

const PublicRoute = () => {
    const user = useUserStore((state) => state.user);

    if (user) {
        return <Navigate to="/products" replace />;
    }

    return <Outlet />;
};


export default PublicRoute;