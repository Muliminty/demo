import React from 'react'
import { Route } from 'react-router-dom'

const renderRoutes = (routes) => {
    return routes.map(route => {
        if (route.children) {
            return (
                <Route key={route.path} path={route.path} element={<route.component />}>
                    {renderRoutes(route.children)}
                </Route>
            );
        }
        return (
            <Route
                key={route.path}
                path={route.path}
                element={<route.component />}
            />
        );
    });
};


export default renderRoutes

