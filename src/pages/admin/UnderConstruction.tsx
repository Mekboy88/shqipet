import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";

export default function UnderConstruction() {
  return (
    <div className="container mx-auto px-6 py-8">
      <Card className="max-w-md mx-auto text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Wrench className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Under Construction</CardTitle>
          <CardDescription>
            This feature is currently being developed and will be available soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We're working hard to bring you this new functionality. 
            Check back later for updates!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}