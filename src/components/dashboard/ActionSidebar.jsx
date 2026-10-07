import React from 'react';

const ActionSidebar = ({
  selectedTheme,
  setSelectedTheme,
  onPreview,
  onPublish,
  publicUrl,
  onAddCustomSection
}) => {
  const themes = [
    { id: 'galaxy', name: 'Galaxy', image: '/textures/galaxy-banner.png' },
    { id: 'lava', name: 'Lava', image: '/textures/lava-banner.png' },
    { id: 'forest', name: 'Forest', image: '/textures/forest-banner.png' },
    { id: 'neon', name: 'Neon', image: '/textures/neon-banner.png' }
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Theme Grid Section */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h3 className="text-sm text-slate-300 mb-2 font-medium">Theme grid</h3>
        <div className="grid grid-cols-2 gap-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`
                h-20 rounded-lg relative overflow-hidden transition-all duration-200
                group
                ${selectedTheme === theme.id ? 'ring-2 ring-blue-500 scale-[1.02]' : 'hover:opacity-80 border border-white/10'}
              `}
            >
              <img 
                src={theme.image} 
                alt={theme.name} 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              <span className="absolute bottom-1 right-2 text-[10px] font-medium text-white/90 bg-black/40 backdrop-blur-sm px-1.5 rounded">
                {theme.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Primary Actions */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
        <button
          onClick={onPreview}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-md py-2 font-medium hover:brightness-110 transition-all shadow-lg shadow-blue-900/20"
        >
          Preview
        </button>
        
        <button
          onClick={onPublish}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-md py-2 font-medium hover:brightness-110 transition-all shadow-lg shadow-blue-900/20"
        >
          Publish
        </button>

        <input
          type="text"
          readOnly
          value={publicUrl || ''}
          placeholder="public URL"
          className="bg-black/40 border border-white/10 text-gray-400 rounded-md py-2 w-full text-center text-sm focus:outline-none"
        />
      </div>

      {/* Custom Section */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-4">
        <h3 className="text-sm text-slate-300 mb-3 font-medium">Custom Section</h3>
        <button
          onClick={onAddCustomSection}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-md py-2 font-medium hover:brightness-110 transition-all shadow-lg shadow-blue-900/20"
        >
          Add Custom Section
        </button>
        <p className="text-xs text-gray-500 text-center mt-2">Create a new tab</p>
      </div>
    </div>
  );
};

export default ActionSidebar;