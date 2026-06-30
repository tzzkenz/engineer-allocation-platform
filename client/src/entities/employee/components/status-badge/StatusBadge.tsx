import { Badge } from "@shared/components/ui/badge";

import type { EmployeeAvailabilityStatus } from "../../types/apiTypes";

const StatusBadge = ({ status }: { status: EmployeeAvailabilityStatus }) => {
  switch (status) {
    case "AVAILABLE":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Available</Badge>;

    case "BUSY":
      return <Badge variant="secondary">Busy</Badge>;
  }
};

export default StatusBadge;
