"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { NoticeModal } from "../notice-modal";
import { Button } from "../ui/button";
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
const AddNotice = ({ devices }: { devices: Device[] }) => {
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setIsNoticeModalOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Notice
      </Button>
      <NoticeModal
        isOpen={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
        devices={devices}
      />
    </>
  );
};

export default AddNotice;
