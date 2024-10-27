"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QrCode, QrCodeIcon, ScanQrCode } from "lucide-react";

export function QrCodeWebsite() {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Scan QR Code</h2>
      <p className="mb-4">
        Scan this QR code to visit the current page on your mobile device
      </p>
      <div className="flex justify-center">
        <QRCodeSVG
          value={currentUrl}
          size={256}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"L"}
          includeMargin={false}
        />
      </div>
    </div>
  );
}

export function QrCodeButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="w-full items-center flex max-w-80 text-2xl mx-auto p-4  rounded-xl mt-4  justify-between bg-accent ">
          Share Website{" "}
          <ScanQrCode size={24} className="size-24 bg-background rounded-xl" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>QR Code</DialogTitle>
        <QrCodeWebsite />
      </DialogContent>
    </Dialog>
  );
}
