const form = document.querySelector("#infobadge-form");
const payload = document.querySelector("#payload");
const uartConnectBtn = document.querySelector("#uart-connect");
const uartSendBtn = document.querySelector("#uart-send");
const uartStatus = document.querySelector("#uart-status");

const preview = {
  name: document.querySelector("#preview-name"),
  role: document.querySelector("#preview-role"),
  company: document.querySelector("#preview-company"),
  social: document.querySelector("#preview-social"),
  qrContainer: document.querySelector("#preview-qr-container"),
};

let qrCode = null;

const defaults = {
  person: "Ada Lovelace",
  role: "Security Researcher",
  company: "thebadg.es",
  social: "@handle",
  qr: "https://thebadg.es",
};

const UART_BAUD = 115200;
let uartPort = null;
let uartWriter = null;
const uartEncoder = new TextEncoder();

const setUartStatus = (message) => {
  uartStatus.textContent = `UART status: ${message}`;
};

const updateUartControls = () => {
  const connected = Boolean(uartPort);
  uartConnectBtn.textContent = connected ? "Disconnect" : "Connect";
  uartSendBtn.disabled = !connected;
};

const closeUart = async () => {
  if (!uartPort) {
    return;
  }

  if (uartWriter) {
    uartWriter.releaseLock();
    uartWriter = null;
  }

  await uartPort.close();
  uartPort = null;
  setUartStatus("not connected.");
  updateUartControls();
};

const syncPayload = () => {
  const data = new FormData(form);
  const values = {
    person: data.get("person")?.trim() || defaults.person,
    role: data.get("role")?.trim() || defaults.role,
    company: data.get("company")?.trim() || defaults.company,
    social: data.get("social")?.trim() || defaults.social,
    qr: data.get("qr")?.trim() || defaults.qr,
  };

  payload.value = [
    values.person,
    values.role,
    values.company,
    values.social,
    values.qr,
  ].join("\n");

  preview.name.textContent = values.person;
  preview.role.textContent = values.role;
  preview.company.textContent = values.company;
  preview.social.textContent = values.social;

  // Update QR code
  preview.qrContainer.innerHTML = "";
  if (typeof QRCode !== "undefined") {
    qrCode = new QRCode(preview.qrContainer, {
      text: values.qr,
      width: 174,
      height: 174,
      colorDark: "#dc143c",
      colorLight: "#f8fbf5",
      correctLevel: QRCode.CorrectLevel.L,
    });
  }
};

form.addEventListener("input", syncPayload);

uartConnectBtn.addEventListener("click", async () => {
  if (!("serial" in navigator)) {
    setUartStatus("Web Serial not supported in this browser.");
    return;
  }

  if (uartPort) {
    await closeUart();
    return;
  }

  try {
    uartPort = await navigator.serial.requestPort({
      filters: [
        { usbVendorId: 0x2e8a, usbProductId: 0x000a }, // Raspberry Pi Pico
        { usbVendorId: 0x2e8a, usbProductId: 0x0005 }, // RP2040 bootloader
        { usbVendorId: 0x2e8a } // Any RP2040 device
      ]
    });
    await uartPort.open({ baudRate: UART_BAUD });
    uartWriter = uartPort.writable.getWriter();
    setUartStatus(`connected at ${UART_BAUD} baud.`);
    updateUartControls();

    uartPort.addEventListener("disconnect", () => {
      setUartStatus("disconnected.");
      uartPort = null;
      uartWriter = null;
      updateUartControls();
    });
  } catch (error) {
    setUartStatus("connection canceled or failed.");
  }
});

uartSendBtn.addEventListener("click", async () => {
  if (!uartPort || !uartWriter) {
    setUartStatus("connect a badge first.");
    return;
  }

  try {
    const lines = payload.value.split("\n");
    for (const line of lines) {
      const data = uartEncoder.encode(`${line}\n`);
      await uartWriter.write(data);
    }
    setUartStatus("payload sent.");
  } catch (error) {
    setUartStatus("send failed. reconnect and try again.");
  }
});

syncPayload();
updateUartControls();
