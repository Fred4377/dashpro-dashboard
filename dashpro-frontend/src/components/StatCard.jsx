import React, { useEffect, useState } from 'react';

const StatCard = ({ title, value, prefix = '', suffix = '', icon: Icon, color, change, trendUp }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (typeof value !== 'number') return;
    
    let startTimestamp = null;
    const duration = 1000; // 1 second animation

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      
      setDisplayValue(Math.floor(easeProgress * value));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    window.requestAnimationFrame(step);
  }, [value]);

  const formattedValue = typeof value === 'number' ? displayValue.toLocaleString() : value;

  const colorStyles = {
    green: 'bg-accent-success/10 text-accent-success',
    blue: 'bg-accent-primary/10 text-accent-primary',
    purple: 'bg-accent-purple/10 text-accent-purple',
    gold: 'bg-accent-warning/10 text-accent-warning',
    red: 'bg-accent-danger/10 text-accent-danger',
  };

  return (
    <div className="card-bg border border-custom rounded-2xl p-6 transition-all duration-300 hover:shadow-lg group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sub text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-light-text dark:text-dark-text group-hover:text-accent-primary transition-colors">
            {prefix}{formattedValue}{suffix}
          </h3>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorStyles[color] || colorStyles.blue}`}>
          <Icon size={24} />
        </div>
      </div>
      
      <div className="flex items-center text-sm">
        <span className={`font-medium flex items-center ${trendUp ? 'text-accent-success' : 'text-accent-danger'}`}>
          {trendUp ? '↑' : '↓'} {change}
        </span>
        <span className="text-sub ml-2">vs last month</span>
      </div>
    </div>
  );
};

export default StatCard;
