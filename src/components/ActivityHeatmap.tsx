import type { ScammerProfile } from '../App';

type ActivityHeatmapProps = {
  personas: ScammerProfile[];
};

export function ActivityHeatmap({ personas }: ActivityHeatmapProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Calculate activity for each hour
  const activityData = hours.map((hour) => {
    let activity = 0;
    personas.forEach((persona) => {
      if (Math.abs(persona.peakHour - hour) <= 2) {
        activity += persona.conversations;
      }
    });
    return activity;
  });

  const maxActivity = Math.max(...activityData);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {hours.map((hour) => {
          const activity = activityData[hour];
          const intensity = activity / maxActivity;
          const opacity = Math.max(0.1, intensity);
          
          return (
            <div key={hour} className="flex-1 space-y-1">
              <div
                className="h-24 rounded-lg transition-all hover:scale-110 cursor-pointer relative group"
                style={{
                  background: `rgba(6, 182, 212, ${opacity})`,
                  border: `1px solid rgba(6, 182, 212, ${Math.min(1, opacity + 0.2)})`
                }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-950 border border-cyan-500/50 rounded-lg px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  <div className="text-cyan-400">{hour}:00</div>
                  <div className="text-slate-400">{activity} msgs</div>
                </div>
              </div>
              <div className="text-xs text-slate-500 text-center">
                {hour % 3 === 0 ? `${hour}h` : ''}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>00:00</span>
        <span className="text-cyan-400">Peak Activity Hours</span>
        <span>23:00</span>
      </div>
    </div>
  );
}