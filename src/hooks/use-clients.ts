import { useContext } from "react";

import { ClientContext } from "@/contexts/client-context";

export const useClients = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClients must be used within ClientProvider");
  }
  return context;
};
