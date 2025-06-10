import { DialogContext } from "@/contexts/dialog-context";
import { useContext } from "react";

export const useDialog = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialog must be used within a DialogProvider");
  return ctx;
};
