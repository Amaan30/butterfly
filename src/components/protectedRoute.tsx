import React, {useContext} from "react";
import { AuthContext } from "../context/authContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
        requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
        const auth = useContext(AuthContext);
        const location = useLocation();
    
        console.log("Auth state in protected route:", auth);
    
        //check if auth exists
        if(!auth){
            return <Navigate to="/login" state={{ from: location }} replace />;
        }
    
        //now safely destructure the auth object
        const { isAuth, user, loading } = auth;
        
        // Add this check
        if (loading) {
            return <div>Loading...</div>; // or some loading spinner
        }
    
        // check for authentication
        if(!isAuth){
            console.log("Not authenticated, redirecting");
            return <Navigate to="/login" state={{ from: location }} replace />;
        }
    
        // check for role-based permission (if required)
        if(requiredRole && user?.role !== requiredRole){
            return <Navigate to="/unauthorized" />;
        }
    
        // If authenticated and authorized, render the child routes
        return <Outlet />;
    };
    
export default ProtectedRoute;