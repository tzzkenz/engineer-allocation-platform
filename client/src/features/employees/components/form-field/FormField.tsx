import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

export default function FormField() {
  return (
    <Card className=" w-full h-full flex justify-center">
      <CardContent className="flex flex-col gap-10 ">
        <div>
          <Label className="ml-2 pb-2">
            FULL NAME<span className="text-red-500">*</span>
          </Label>
          <Input placeholder="eg:Amal Thomas" />
        </div>

        <div className="sm:flex gap-5 ">
          <div className="w-full">
            <Label className="ml-2 pb-2">EMAIL ADDRESS</Label>
            <Input placeholder="eg:amal@helix.com" />
          </div>
          <div className="w-full">
            <Label className="ml-2 pb-2">CURRENT ROLE</Label>
            <Input placeholder="Select Role....." />
          </div>
        </div>
        <div className="sm:flex gap-5">
          <div className="w-full">
            <Label className="ml-2 pb-2">TOTAL EXPERIENCE</Label>
            <Input placeholder="0.0 Years" />
          </div>
          <div className="w-full">
            <Label className="ml-2 pb-2">AVAILABILITY STATUS</Label>

            <Select defaultValue="Available">
              <SelectTrigger className="bg-[#F2F3F9] w-full">
                <SelectValue placeholder="Available" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="notice">On Notice Period</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
