import React from 'react';

const ThemeShowcase = () => {
  const themes = [
    { title: "Galaxy Theme", active: true, gradient: "from-blue-900 to-purple-900" },
    { title: "Lava Theme", active: false, gradient: "from-red-900 to-orange-900" },
    { title: "Animated Forest", active: false, gradient: "from-green-900 to-emerald-900" },
    { title: "Neon Tech Theme", active: false, gradient: "from-gray-900 to-gray-800" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-white text-center mb-8">Themes</h2>
      
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {themes.map((theme, index) => (
            <div 
              key={index}
              className={`
                relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer transition-all duration-300
                ${theme.active ? 'border-2 border-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.3)]' : 'border border-white/10 hover:border-white/30'}
              `}
            >
              {/* Image Placeholder */}
              <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-60`} />
              
              {/* Text Label */}
              <div className="absolute bottom-4 right-4">
                <span className="text-white text-sm font-medium bg-black/40 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
                  {theme.title}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Slider Indicator */}
        <div className="flex justify-center gap-2">
          <div className="h-1 w-8 bg-white rounded-full" />
          <div className="h-1 w-8 bg-white/20 rounded-full" />
          <div className="h-1 w-8 bg-white/20 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ThemeShowcase;