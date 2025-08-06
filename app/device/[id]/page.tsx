import SingleDevice from "@/components/devices/single-device";
import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getDeviceById } from "@/query/device.query";
import { ArrowLeft, Bell, Clock, RefreshCw, Wifi, WifiOff } from "lucide-react";
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

export default async function DeviceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const device: Device = await getDeviceById(id);

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

  if (!device) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Device not found
            </h3>
            <Link href={"/"}>
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href={"/"}>
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{device.id}</h1>
            <p className="text-gray-600 mt-2">Device Details & Control</p>
          </div>
          <div className="flex items-center gap-2">
            {device.status === "online" ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            <Badge
              variant={device.status === "online" ? "default" : "destructive"}
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Information */}
        <Card className="bg-white border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-600" />
              Device Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Status
                </Label>
                <p className="text-lg font-semibold capitalize">
                  {device.status}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Current Mode
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  {device.mode === "clock" ? (
                    <Clock className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Bell className="w-4 h-4 text-orange-500" />
                  )}
                  <span className="font-semibold capitalize">
                    {device.mode}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Uptime
                </Label>
                <p className="text-lg font-semibold">{device.uptime}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Free Heap
                </Label>
                <p className="text-lg font-semibold">{device.free_heap}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-600">
                Last Seen
              </Label>
              <p className="text-lg font-semibold">
                {formatLastSeen(device.last_seen)}
              </p>
            </div>

            {device.current_notice && (
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <Label className="text-sm font-medium text-orange-800">
                  Current Notice
                </Label>
                <p className="text-orange-700 mt-1">{device.current_notice}</p>
                {device.duration ? (
                  <p className="text-sm text-orange-600 mt-2">
                    Duration: {device.duration} minutes
                  </p>
                ) : (
                  ""
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Control */}
        <SingleDevice device={device} />
      </div>
    </div>
  );
}
