"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { changeDeviceMode, sendNoticeToDevice } from "@/query/device.query";
import { format } from "date-fns";
import { Bell, CalendarIcon, Clock, RefreshCw, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

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

const SingleDevice = ({ device }: { device: Device }) => {
  const [saving, setSaving] = useState(false);
  const [newMode, setNewMode] = useState<"clock" | "notice">(device.mode);
  const [newNotice, setNewNotice] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("12:00");

  const calculateDuration = () => {
    if (!date) return 0;

    const [hours, minutes] = time.split(":").map(Number);
    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const diffInMs = selectedDateTime.getTime() - now.getTime();
    const diffInMinutes = Math.max(0, Math.floor(diffInMs / (1000 * 60)));

    return diffInMinutes;
  };

  const handleSave = async () => {
    if (!device) return;

    setSaving(true);

    if (newNotice) {
      await sendNoticeToDevice(device.id, {
        notice: newNotice,
        duration: calculateDuration(), // Assuming duration is not needed for this example
      });
    } else if (newMode && newMode !== device.mode) {
      await changeDeviceMode(device.id, newMode);
    }

    // Mock API call to update device
    setTimeout(() => {
      setSaving(false);
      toast("Device Updated", {
        description: "Device settings have been saved successfully.",
      });
    }, 1000);
  };

  return (
    <Card className="bg-white border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="w-5 h-5 text-blue-600" />
          Device Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="mode">Device Mode</Label>
          <Select
            value={newMode}
            onValueChange={(value: "clock" | "notice") => setNewMode(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clock">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Clock Mode
                </div>
              </SelectItem>
              <SelectItem value="notice">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notice Mode
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notice">Notice Message</Label>
          <Textarea
            id="notice"
            placeholder="Enter notice message..."
            value={newNotice}
            onChange={(e) => setNewNotice(e.target.value)}
            rows={4}
          />
        </div>

        {/* Duration Settings */}
        <div className="space-y-4">
          <Label>Display Duration</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-transparent"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">End Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          {date && (
            <p className="text-sm text-gray-600">
              Duration: {calculateDuration()} minutes
            </p>
          )}
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SingleDevice;
