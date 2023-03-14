import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
    const Ilogading = localStorage.getItem("JWT_USUARIO");
    if(!Ilogading){
        return <Navigate to={'/404'}></Navigate>
    }
    return (
        <Navigate to={'/usuarios'}></Navigate>
    );
}

export default PrivateRoutes;
