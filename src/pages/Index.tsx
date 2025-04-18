import { CarValueCalculator } from "@/components/CarValueCalculator";
import { Car } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/authSlice';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      <header className="py-8 bg-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Car className="w-8 h-8 mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold">
                Auto Price Oracle
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-blue-100">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-800 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
          <p className="text-center mt-2 text-blue-100 max-w-2xl mx-auto">
            Calculate the true value of a car based on price, mileage, and estimated lifespan
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            Car Value Calculator
          </h2>
          <CarValueCalculator />
        </section>

        <section className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 mb-12">
          <h2 className="text-xl font-bold mb-4 text-blue-800">How It Works</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Our calculator estimates a car's value using a simple yet effective formula:
            </p>
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="font-mono text-center">
                Value Score = Price ÷ Remaining Miles
              </p>
              <p className="text-sm text-center mt-2">
                where Remaining Miles = Maximum Expected Miles - Current Mileage
              </p>
            </div>
            <p>
              A <strong>lower score</strong> indicates a better value for your money, as you're paying less for each remaining mile of the car's estimated life.
            </p>
            <p>
              Different car makes have different expected lifespans based on reliability data. For example, Toyota and Honda vehicles typically have longer expected lifespans than some luxury brands.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© 2025 Auto Price Oracle - A tool to help you make smarter car buying decisions</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
