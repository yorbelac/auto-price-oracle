import { CarValueCalculator } from "@/components/CarValueCalculator";
import { ExplanatoryModal } from "@/components/ExplanatoryModal";
import { Car } from "lucide-react";

const Index = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-8 bg-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <Car className="w-8 h-8" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  Carpool
                </h1>
              </div>
              <p className="mt-2 text-blue-100">
                Calculate the true value of used cars based on price, mileage, and estimated lifespan
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="share-button hidden">Share</button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            Car Value Calculator
          </h2>
          <div className="car-form">
            <CarValueCalculator />
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center text-sm flex items-center justify-center gap-2">
          <p>© {currentYear} Carpool by Workpool.app</p>
          <ExplanatoryModal />
        </div>
      </footer>

      {/* Floating action buttons bottom right */}
      <div id="floating-actions" className="fixed bottom-4 right-4 z-50 flex flex-row items-end gap-3">
        <a
          href="https://www.buymeacoffee.com/workpool"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg transition-colors shadow-lg border border-yellow-500"
        >
          <span className="text-sm">☕</span>
          <span className="text-sm font-medium hidden md:inline">Buy me a coffee</span>
        </a>
      </div>
    </div>
  );
};

export default Index;
