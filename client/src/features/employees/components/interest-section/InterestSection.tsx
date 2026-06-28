import { Button } from "@/shared/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Plus } from "lucide-react";

const InterestSection = ({ interests }) => {
  return (
    <Card className="flex-1 rounded-3xl border-[rgba(199,196,215,0.3)] gap-0">
      <CardHeader className="px-8 pt-8 pb-0 border-b-0">
        <CardTitle className="text-[16px] font-normal text-[#2e3040]">Areas of Interest</CardTitle>
        <CardAction>
          <Button variant="secondary" size="sm">
            <Plus className="w-2.5 h-2.5" />
            Add Interest
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="px-8 pb-8 pt-6 flex flex-col justify-end gap-3 flex-1">
        {interests.map((interest) => (
          <div
            key={interest}
            className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#eceef4] shadow-[4px_4px_12px_rgba(0,0,0,0.05),-4px_-4px_12px_rgba(255,255,255,0.8)]"
          >
            <span className="text-[14px] font-semibold text-[#5b5d6d]">{interest}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default InterestSection;
