"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { sendNoticeToDevice } from "@/query/device.query";
import { format } from "date-fns";
import { CalendarIcon, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  devices: Device[];
}

export function NoticeModal({ isOpen, onClose, devices }: NoticeModalProps) {
  const [message, setMessage] = useState("");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("12:00");
  const [sending, setSending] = useState(false);

  const handleDeviceToggle = (deviceId: string) => {
    setSelectedDevices((prev) =>
      prev.includes(deviceId)
        ? prev.filter((id) => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDevices.length === devices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(devices.map((d) => d.id));
    }
  };

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

  const handleSend = async () => {
    if (!message.trim() || selectedDevices.length === 0) {
      toast("Validation Error", {
        description: "Please enter a message and select at least one device.",
      });
      return;
    }

    setSending(true);

    console.log({
      notice: message,
      duration: calculateDuration(),
      ids: selectedDevices,
    });

    // multiple promise call
    await Promise.all(
      selectedDevices.map((deviceId) =>
        sendNoticeToDevice(deviceId, {
          notice: message,
          duration: calculateDuration(),
        })
      )
    );

    // Mock API call to send notice
    setTimeout(() => {
      toast("Notice Sent", {
        description: `Notice sent to ${selectedDevices.length} device(s) successfully.`,
      });

      // Reset form
      setMessage("");
      setSelectedDevices([]);
      setDate(undefined);
      setTime("12:00");
      setSending(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-600" />
            Send Notice to Devices
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Notice Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your notice message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
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

          {/* Device Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Select Devices</Label>
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                {selectedDevices.length === devices.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
              {devices.map((device) => (
                <div key={device.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={device.id}
                    checked={selectedDevices.includes(device.id)}
                    onCheckedChange={() => handleDeviceToggle(device.id)}
                  />
                  <Label
                    htmlFor={device.id}
                    className="flex-1 cursor-pointer flex items-center justify-between"
                  >
                    <span>{device.id}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        device.status === "online"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {device.status}
                    </span>
                  </Label>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-600">
              {selectedDevices.length} of {devices.length} devices selected
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={sending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {sending ? (
                <>
                  <Send className="w-4 h-4 mr-2 animate-pulse" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Notice
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
