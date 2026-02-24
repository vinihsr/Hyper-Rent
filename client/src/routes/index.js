import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/authContext';
import Sidebar from '../components/sidebar/index';
import RouteWrapper from '../routes/routeWrapper'; 
import Login from '../pages/login/index';
import Signup from '../pages/signup/index';
import Dashboard from '../pages/dashboard/index';
import Admin from '../pages/admin/index';
import RentPage from '../pages/rent/index';
import Fleet from '../pages/fleet/index'
import MyRentals from '../pages/myRentals/index'
import History from '../pages/history/index'

const PrivateLayout = ({ children }) => (
  <div className="flex bg-[#050505]  min-h-screen">
    <Sidebar />
    <main className="flex-1 ml-64 p-8">
      {children}
    </main>
  </div>
);

function App() {
  return (
      <AuthProvider>
        <Routes>

          <Route 
            path="/login" 
            element={
              <RouteWrapper isPrivate={false}>
                <Login />
              </RouteWrapper>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <RouteWrapper isPrivate={false}>
                <Signup />
              </RouteWrapper>
            } 
          />

          <Route 
            path="/dashboard" 
            element={
              <RouteWrapper isPrivate={true}>
                <PrivateLayout><Dashboard /></PrivateLayout>
              </RouteWrapper>
            } 
          />
          
          <Route 
            path="/rent" 
            element={
              <RouteWrapper isPrivate={true}>
                <PrivateLayout><RentPage /></PrivateLayout>
              </RouteWrapper>
            } 
          />

          <Route 
            path="/admin" 
            element={
              <RouteWrapper isPrivate={true} adminOnly={true}>
                  <Admin /> 
              </RouteWrapper>
            } 
          />

          <Route 
            path="/fleet" 
            element={
              <RouteWrapper isPrivate={true}>
                <PrivateLayout><Fleet /></PrivateLayout>
              </RouteWrapper>
            } 
          />

          <Route 
            path="/my-rentals" 
            element={
              <RouteWrapper isPrivate={true}>
                <PrivateLayout><MyRentals /></PrivateLayout>
              </RouteWrapper>
            } 
          />

          <Route 
            path="/history" 
            element={
              <RouteWrapper isPrivate={true}>
                <PrivateLayout><History /></PrivateLayout>
              </RouteWrapper>
            } 
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </AuthProvider>
  );
}

export default App;