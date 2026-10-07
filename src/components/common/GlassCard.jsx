import React from 'react';

const GlassCard = ({ children, title, icon, className = '' }) => {
  return (
    <div
      className={`
        glass-morphism rounded-2xl p-6 shadow-2xl
        transition-all duration-300 ease-in-out
        hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]
        ${className}
      `}
    >
      {(title || icon) && (
        <div className="flex items-center gap-3 mb-4 text-white">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          {title && <h3 className="text-xl font-semibold">{title}</h3>}
        </div>
      )}
      <div className="text-gray-100">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;