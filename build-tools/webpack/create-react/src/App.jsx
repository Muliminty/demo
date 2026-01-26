import React, { Suspense } from 'react'
import { BrowserRouter, Routes,Link } from 'react-router-dom'
import routes from '@/routes/config'
import renderRoutes from '@/routes'


const App = () => (
    <BrowserRouter>
        <div className="app-container">
            <nav>
                <ul>
                    {routes.map(route => (
                        <li key={route.path}>
                            <Link to={route.path}>{route.name}</Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <main>
                <Suspense fallback={<div>加载中...</div>}>
                    <Routes>
                        {renderRoutes(routes)}
                    </Routes>
                </Suspense>
            </main>
        </div>
    </BrowserRouter>
)

export default App