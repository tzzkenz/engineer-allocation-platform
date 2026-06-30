import type { RequirementStatus } from "@/entities/project/types/apiTypes";

export const REQUIREMENT_NAME_TO_LABEL: Record<RequirementStatus, string> = {
  APPROVED: "Approved",
  PENDING: "Pending",
  REJECTED: "Rejected",
};
