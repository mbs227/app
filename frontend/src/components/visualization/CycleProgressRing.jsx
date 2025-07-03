import React from 'react';

const CycleProgressRing = ({ 
  progress, 
  currentWeek, 
  totalWeeks = 12, 
  cycleTitle, 
  size = 120,
  strokeWidth = 8 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  const center = size / 2;
  
  const getProgressColor = () => {
    if (progress >= 90) return '#10b981'; // green
    if (progress >= 70) return '#3b82f6'; // blue  
    if (progress >= 40) return '#f59e0b'; // yellow
    return '#8b5cf6'; // purple
  };

  const getStatusIcon = () => {
    if (progress >= 100) return '🎉';
    if (progress >= 75) return '🚀';
    if (progress >= 50) return '💪';
    if (progress >= 25) return '🌱';
    return '🎯';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={getProgressColor()}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl mb-1">{getStatusIcon()}</div>
          <div className="text-lg font-bold text-gray-900">{Math.round(progress)}%</div>
          <div className="text-xs text-gray-600">
            Week {currentWeek}/{totalWeeks}
          </div>
        </div>
      </div>
      
      {cycleTitle && (
        <div className="mt-3 text-center">
          <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
            {cycleTitle}
          </div>
        </div>
      )}
    </div>
  );
};

export default CycleProgressRing;