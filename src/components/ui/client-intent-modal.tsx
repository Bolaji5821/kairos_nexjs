"use client";

import { useEffect, useState } from "react";
import { IntentModal, IntentModalProps } from "./intent-modal";

export function ClientIntentModal(props: IntentModalProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <IntentModal {...props} />;
}