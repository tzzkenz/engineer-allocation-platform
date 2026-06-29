const InfoField = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-extrabold tracking-wider opacity-60 uppercase">{label}</span>
      <span className="text-base ">{value}</span>
    </div>
  );
};

export default InfoField;
