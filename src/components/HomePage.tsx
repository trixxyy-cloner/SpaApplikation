import React from "react";

import { type ThemeDay } from "../constants/themeDays";

interface HomePageProps {
  onSelectPackage: (packageType: "Varm" | "Kall" | "Temakur") => void;
  onSelectThemeDay?: (date: string) => void;
  themeDays: ThemeDay[];
}

const getThemeDayEmoji = (name: string): string => {
  const emojiMap: Record<string, string> = {
    "Nyårsdagen": "🎆",
    "Påskdagen": "🐣",
    "Midsommardagen": "🌞",
    "Alla helgons dag": "👻",
  };
  return emojiMap[name] || "✨";
};

const HomePage: React.FC<HomePageProps> = ({ onSelectPackage, onSelectThemeDay, themeDays }) => {
  // Deduplicera och filtrera bort temadagar som redan har passerat
  const today = new Date().toISOString().split('T')[0];
  
  // Deduplicera först med Map (garanterar unika)
  const dedupMap = new Map<string, ThemeDay>();
  themeDays.forEach(td => dedupMap.set(td.date, td));
  
  // Gruppera efter hemdag-namn, ta bara den första (tidigaste) framtida förekomsten
  const themesByName = new Map<string, ThemeDay>();
  Array.from(dedupMap.values())
    .filter((td) => td.date > today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach(td => {
      if (!themesByName.has(td.name)) {
        themesByName.set(td.name, td);
      }
    });
  
  const futureThemeDays = Array.from(themesByName.values()).sort((a, b) => 
    a.date.localeCompare(b.date)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex flex-col">
      {/* Header */}
      <div className="pt-20 pb-40 text-center px-4">
        <h1 className="text-6xl font-bold text-white mb-4">Nordic Wellness</h1>
        <p className="text-xl text-blue-100">
          Boka din perfekta spa-upplevelse idag
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-20 -mt-20 flex-1">
        {/* Vanliga Paket */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Warm Package */}
          <button
            onClick={() => onSelectPackage("Varm")}
            className="bg-white rounded-lg shadow-2xl overflow-hidden hover:shadow-3xl transition transform hover:scale-105 duration-300 text-left cursor-pointer"
          >
            <div className="bg-gradient-to-r from-orange-400 to-red-500 h-32"></div>
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                🔥 Varma paketet
              </h2>
              <p className="text-gray-600 mb-6">
                Slå av dig stressen och värm upp kroppen i vår behagliga värmebassäng. Perfekt för avslappning och återhämtning.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Varmvattenbassäng</li>
                <li>✓ Entspännande miljö</li>
                <li>✓ Bokningsbar 3 gånger per dag</li>
                <li>✓ 700 kr/person</li>
              </ul>
            </div>
          </button>

          {/* Cold Package */}
          <button
            onClick={() => onSelectPackage("Kall")}
            className="bg-white rounded-lg shadow-2xl overflow-hidden hover:shadow-3xl transition transform hover:scale-105 duration-300 text-left cursor-pointer"
          >
            <div className="bg-gradient-to-r from-blue-400 to-cyan-500 h-32"></div>
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                ❄️ Kalla paketet
              </h2>
              <p className="text-gray-600 mb-6">
                Ge dig själv en energiboost i vår fräscha kallvattenbassäng. Perfekt för återhämtning och aktivering.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Kallvattenbassäng</li>
                <li>✓ Energikick</li>
                <li>✓ Bokningsbar 3 gånger per dag</li>
                <li>✓ 500 kr/person</li>
              </ul>
            </div>
          </button>
        </div>

        {/* Temadagar Section */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-white mb-6 text-center">
            ✨ Temadags!
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {futureThemeDays.map((day) => (
              <button
                key={day.date}
                onClick={() => onSelectThemeDay?.(day.date)}
                className="bg-gradient-to-br from-amber-200 to-yellow-400 rounded-lg shadow-2xl overflow-hidden hover:shadow-3xl transition transform hover:scale-105 duration-300 text-left cursor-pointer"
              >
                <div className="bg-gradient-to-r from-amber-400 to-yellow-500 h-20 flex items-center justify-center">
                  <span className="text-4xl">{getThemeDayEmoji(day.name)}</span>
                </div>
                <div className="p-6">
                  <h4 className="text-2xl font-bold text-gray-800 mb-3">
                    {day.name}
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Heldag från 10-17
                  </p>
                  <p className="text-xl font-bold text-amber-900">
                    1000 kr/person
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info Text */}
        <div className="text-center mb-12">
          <p className="text-white text-lg">
            Klicka på ett paket ovan för att börja boka
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black bg-opacity-50 text-white text-center py-6 mt-auto">
        <p className="text-sm">
          Vi är öppna alla dagar förutom måndagar och svenska helgdagar
        </p>
      </div>
    </div>
  );
};

export default HomePage;