import { lazy } from 'react'
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './Routes/ProtectedRoute';

const RootLayOut = lazy(() => import('./Routes/RootLayOut'));
const Home = lazy(() => import('./Pages/Module/Home/Home'));
const Registration = lazy(() => import('./Pages/Module/Registration/Registration'));
const Revisit = lazy(() => import('./Pages/Module/Registration/Revisit'));
const Billing = lazy(() => import('./Pages/Module/Billing/Billing'));
const Doctor = lazy(() => import('./Pages/Setting/Master/Doctor'));
const Settings = lazy(() => import('./Pages/Setting/Master/Settings'));
const ProcedureMaster = lazy(() => import('./Pages/Setting/Master/ProcedureMaster'));


function App() {
  const router = createBrowserRouter([
    { path: '/', element: <RootLayOut /> },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: '/Home', element: <Home />, children: [
            { path: 'Registration', element: <Registration /> },
            { path: 'Revisit', element: <Revisit /> },
            { path: 'Billing', element: <Billing /> },
            { path: 'Doctor', element: <Doctor /> },
            { path: 'Settings', element: <Settings /> },
            { path: 'ProcedureMaster', element: <ProcedureMaster /> },
          ]
        },
      ]
    },
  ])

  return (
    <div className="flex flex-col min-h-svh bg-cover bg-center">
      <ToastContainer />
      <Suspense fallback={<div>Loading...</div>} >
        <RouterProvider router={router} />
      </Suspense>
    </div>
  );
}

export default App;
