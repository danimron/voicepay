import { useState, useCallback } from "react";

export interface QRGeneratorHook {
  generateStaticQR: () => string;
  generateDynamicQR: (amount: number, merchantId?: string) => string;
  qrData: string;
}

export function useQRGenerator(): QRGeneratorHook {
  const [qrData, setQrData] = useState("");

  const generateStaticQR = useCallback(() => {
    // Generate dummy static QRIS data
    const staticData = {
      version: "01",
      type: "11",
      merchant: "VOICEPAY_MERCHANT",
      id: "ID.CO.QRIS.WWW",
      category: "5411",
      currency: "360",
      country: "ID",
      name: "VoicePay Merchant",
      city: "Jakarta",
    };

    const qrString = JSON.stringify(staticData);
    setQrData(qrString);
    return qrString;
  }, []);

  const generateDynamicQR = useCallback(
    (amount: number, merchantId = "SMARTPAY_001") => {
      // Generate dummy dynamic QRIS data with amount
      const dynamicData = {
        version: "01",
        type: "12",
        merchant: merchantId,
        id: "ID.CO.QRIS.WWW",
        category: "5411",
        currency: "360",
        amount: amount.toString(),
        country: "ID",
        name: "VoicePay Merchant",
        city: "Jakarta",
        timestamp: Date.now(),
      };

      const qrString = JSON.stringify(dynamicData);
      setQrData(qrString);
      return qrString;
    },
    [],
  );

  return {
    generateStaticQR,
    generateDynamicQR,
    qrData,
  };
}
