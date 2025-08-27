import { BannerMessageType } from "@/components/BannerMessage";
import { createContext, useContext } from "react";

interface ToastMessageContextType {
  showToastMessage(message: string, type: BannerMessageType, timeout: number, title?: string): void;
}

export const ToastMessageContext = createContext<ToastMessageContextType|null>(null);

export const useToastMessage = () => {
  const context = useContext(ToastMessageContext);

  if (!context) {
    throw new Error("useToastMessage must be used within a ToastMessageProvider");
  }
  
  return context.showToastMessage;
};