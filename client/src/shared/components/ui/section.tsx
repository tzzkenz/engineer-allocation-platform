import { Card, CardContent } from "./card";

type PageSectionProps = {
  title: string;
  description?: string;
  breadcrumbs?: string[];
  additionalContent?: React.ReactNode;
};
const PageSection: React.FC<PageSectionProps> = ({
  title,
  description,
  breadcrumbs,
  additionalContent,
}) => {
  return (
    <Card className=" w-full bg-transparent ring-0">
      <CardContent className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-bold  tracking-tight leading-9">{title}</h1>
          {description && <p className="text-sm font-medium  mt-0.5">{description}</p>}
        </div>
        {additionalContent && <div>{additionalContent}</div>}
      </CardContent>
    </Card>
  );
};

export default PageSection;
