const apiUrl = "https://eee.rejoyan.me";
// const apiUrl = "http://localhost:5050";

export const getAllDevices = async () => {
  const devices = await fetch(`${apiUrl}/api/v1/devices`, {
    cache: "no-store",
  });
  if (!devices.ok) {
    throw new Error("Failed to fetch devices");
  }
  const data = await devices.json();
  return data.data;
};

export const getDeviceById = async (id: string) => {
  const device = await fetch(`${apiUrl}/api/v1/devices/${id}`, {
    cache: "no-store",
  });
  if (!device.ok) {
    throw new Error(`Failed to fetch device with id ${id}`);
  }
  const data = await device.json();
  return data.data;
};

export const sendNoticeToDevice = async (
  id: string,
  payload: {
    notice?: string;
    duration?: number | null;
  }
) => {
  const response = await fetch(`${apiUrl}/api/v1/devices/${id}/notice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to send notice to device with id ${id}`);
  }

  const data = await response.json();
  return data;
};

export const changeDeviceMode = async (
  id: string,
  mode: "clock" | "notice"
) => {
  const response = await fetch(`${apiUrl}/api/v1/devices/${id}/mode`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mode }),
  });

  if (!response.ok) {
    throw new Error(`Failed to change mode for device with id ${id}`);
  }

  const data = await response.json();
  return data;
};
