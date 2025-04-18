import { useNavigate } from "react-router-dom";
import { CarValueCalculator } from "@/components/CarValueCalculator";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/authSlice';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <header className="bg-blue-700 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Car className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Carpool</h1>
              </div>
              <p className="text-blue-100">
                Calculate the true value of a car based on price, mileage, and estimated lifespan
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span>Welcome, {user?.name}</span>
              <Button 
                variant="secondary" 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <CarValueCalculator />
      </main>
    </>
  );
};

export default Dashboard; 