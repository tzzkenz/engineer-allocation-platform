import { Skeleton } from "@/shared/components/ui/skeleton";

import { SectionCard, SectionCardInner, SectionHeader } from "../../section/SectionCard";

const InfoFieldSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-3 w-20" />
    <Skeleton className="h-5 w-40" />
  </div>
);

const ProjectInformationSkeleton = () => {
  return (
    <SectionCard>
      <SectionCardInner>
        <SectionHeader
          title="Project Information"
          actions={
            <div className="flex gap-2">
              <Skeleton className="h-9 w-28 rounded-md" />
              <Skeleton className="h-9 w-40 rounded-md" />
            </div>
          }
        />

        <div className="grid grid-cols-1 gap-x-12 gap-y-6 sm:grid-cols-2 w-full">
          <InfoFieldSkeleton />
          <InfoFieldSkeleton />
          <InfoFieldSkeleton />
          <InfoFieldSkeleton />
        </div>
      </SectionCardInner>
    </SectionCard>
  );
};

export default ProjectInformationSkeleton;
