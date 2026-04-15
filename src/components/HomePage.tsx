import React from "react";

interface HomePageProps {
  onStartBooking: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartBooking }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex flex-col">
      {/* Header */}
      <div className="pt-20 pb-40 text-center px-4">
        <h1 className="text-6xl font-bold text-white mb-4">Spa Bokningar</h1>
        <p className="text-xl text-blue-100">
          Boka din perfekta spa-upplevelse idag
        </p>
      </div>

      {/* Packages */}
      <div className="max-w-6xl mx-auto px-4 pb-20 -mt-20">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Warm Package */}
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden hover:shadow-3xl transition transform hover:scale-105 duration-300">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 h-32"></div>
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Varm Paket
              </h2>
              <p className="text-gray-600 mb-6">
                Slå av dig stressen och värm upp kroppen i vår behagliga
                värmebassäng. Perfekt för avslappning och återhämtning.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Varmvattenbassäng</li>
                <li>✓ Entspännande miljö</li>
                <li>✓ Bokingsbar 3 gånger per dag</li>
              </ul>
            </div>
          </div>

          {/* Cold Package */}
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden hover:shadow-3xl transition transform hover:scale-105 duration-300">
            <div className="bg-gradient-to-r from-blue-400 to-cyan-500 h-32"></div>
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Kall Paket
              </h2>
              <p className="text-gray-600 mb-6">
                Ge dig själv en energiboost i vår fräsch kallvattenbassäng.
                Perfekt för återhämtning och aktivering.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Kallvattenbassäng</li>
                <li>✓ Energikick</li>
                <li>✓ Bokningsbar 3 gånger per dag</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center pb-20">
        <button
          onClick={onStartBooking}
          className="bg-white hover:bg-gray-100 text-blue-900 font-bold py-4 px-12 rounded-lg shadow-lg transform hover:scale-110 transition duration-300 text-lg"
        >
          Börja Boka Nu
        </button>
      </div>

      {/* Footer Info */}
      <div className="bg-black bg-opacity-50 text-white text-center py-6 mt-auto">
        <p className="text-sm">
          Vi är öppna alla dagar förutom måndagar och svenska helgdagar
        </p>
      </div>
    </div>
  );
};

export default HomePage;