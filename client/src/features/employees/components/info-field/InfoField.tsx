const InfoField = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-extrabold tracking-wider text-[#767586] uppercase">
        {label}
      </span>
      <span className="text-base text-[#2e3040]">{value}</span>
    </div>
  );
};

export default InfoField;
