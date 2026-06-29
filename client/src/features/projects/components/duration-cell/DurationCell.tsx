const DurationCell = ({ project }) => {
  const pct = project.totalMonths === 0 ? 0 : (project.durationMonths / project.totalMonths) * 100;
  const barColor = project.status === "on_hold" ? "#767586" : "#4648d4";

  return (
    <div className="flex flex-col gap-2">
      <span className="text-base font-medium ">
        {project.durationMonths} / {project.totalMonths} Months
      </span>
      <div className="h-1.5 rounded-full  overflow-hidden w-full min-w-[80px]">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
};

export default DurationCell;
