import React from 'react';
import {useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';

const requireAuth = (WrappedComponent) => {
    return (props) => {
        const isAuthenticated = useSelector((state) => state.auth.token);
        if (!isAuthenticated) {
            return <Navigate to="/login"/>;
        }

        return <WrappedComponent {...props} />;
    };
};

export default requireAuth;