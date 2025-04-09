import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function MarksOverview({ marks, total }) {
  const percentage = (marks / total) * 100;

  return (
    <Card className="w-full max-w-sm shadow-none border bg-sidebar">
      
      <CardContent className="flex flex-col gap-4">
        <div className="text-3xl font-bold text-primary">
          {marks}{" "}
          <span className="text-muted-foreground text-base font-medium">
            / {total} Marks
          </span>
        </div>

        <Progress value={percentage} className="h-3" />

        <div className="text-sm text-muted-foreground">
          {Math.round(percentage)}% scored
        </div>
      </CardContent>
    </Card>
  );
}
