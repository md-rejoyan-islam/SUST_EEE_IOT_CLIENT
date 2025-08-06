"use client";

import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-white border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Analytics Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Analytics and reporting page - Coming soon!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
