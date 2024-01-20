import React from 'react';
import { formatRelativeTime } from '../utils/formatters';

const ActivityFeed = ({ activities }) => {
  
  const getIconAndColor = (color) => {
    switch (color) {
      case 'blue': return 'bg-accent-primary text-white';
      case 'green': return 'bg-accent-success text-white';
      case 'red': return 'bg-accent-danger text-white';
      case 'yellow': return 'bg-accent-warning text-white';
      case 'purple': return 'bg-accent-purple text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="card-bg border border-custom rounded-2xl p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">Recent Activity</h3>
      </div>
      
      <div className="relative pl-2">
        {/* Timeline line */}
        <div className="absolute top-2 bottom-2 left-5 w-px bg-light-border dark:bg-dark-border"></div>
        
        <div className="space-y-6">
          {activities?.map((activity, index) => (
            <div key={activity._id || index} className="relative flex gap-4 items-start group">
              <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs shadow-sm ${getIconAndColor(activity.color)}`}>
                {activity.icon}
              </div>
              
              <div className="flex-1 pt-1">
                <p className="text-sm font-medium text-light-text dark:text-dark-text group-hover:text-accent-primary transition-colors">
                  {activity.description}
                </p>
                <p className="text-xs text-sub mt-1">
                  {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
          
          {(!activities || activities.length === 0) && (
            <p className="text-sm text-sub text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;
