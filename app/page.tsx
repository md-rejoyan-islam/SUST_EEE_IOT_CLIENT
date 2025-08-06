import AddNotice from "@/components/home/add-notice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllDevices } from "@/query/device.query";
import { Bell, Clock, Wifi, WifiOff } from "lucide-react";
import Link from "next/link";

interface Device {
  id: string;
  status: "online" | "offline";
  last_seen: string;
  mode: "clock" | "notice";
  current_notice: string | null;
  pending_notice: boolean;
  uptime: number;
  free_heap: number;
  duration: number | null;
}

export default async function HomePage() {
  const devices: Device[] = await getAllDevices();

  const formatLastSeen = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
  //       <Navigation />
  //       <div className="container mx-auto px-4 py-8">
  //         <div className="flex justify-center items-center h-64">
  //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            IoT Device Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor and control your connected devices
          </p>
        </div>
        <AddNotice devices={devices} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => (
          <Card
            key={device.id}
            className="hover:shadow-lg transition-shadow duration-200 bg-white border-0 shadow-md"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {device.id}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {device.status === "online" ? (
                    <Wifi className="w-4 h-4 text-green-500" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-500" />
                  )}
                  <Badge
                    variant={
                      device.status === "online" ? "default" : "destructive"
                    }
                    className={
                      device.status === "online"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : ""
                    }
                  >
                    {device.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mode:</span>
                <div className="flex items-center gap-1">
                  {device.mode === "clock" ? (
                    <Clock className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Bell className="w-4 h-4 text-orange-500" />
                  )}
                  <Badge variant="outline" className="capitalize">
                    {device.mode}
                  </Badge>
                </div>
              </div>

              {device.current_notice && (
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-800 font-medium">
                    Current Notice:
                  </p>
                  <p className="text-sm text-orange-700">
                    {device.current_notice}
                  </p>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Uptime:</span>
                  <span className="font-medium">{device.uptime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Free Heap:</span>
                  <span className="font-medium">{device.free_heap}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Seen:</span>
                  <span className="font-medium text-xs">
                    {formatLastSeen(device.last_seen)}
                  </span>
                </div>
              </div>

              <Link href={`/device/${device.id}`}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {devices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Wifi className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No devices found
          </h3>
          <p className="text-gray-600">
            Connect your IoT devices to get started.
          </p>
        </div>
      )}
    </div>
  );
}
