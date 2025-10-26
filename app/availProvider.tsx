'use client';
import { NexusProvider } from '@avail-project/nexus-widgets';
import DynamicBridgeWidget from "@/components/availNexus/buttons/Bridge";
import DynamicTransferWidget from "@/components/availNexus/buttons/Transfer";
import DynamicBridgeAndExecuteWidget from "@/components/availNexus/buttons/BridgeAndExecute";

export default function ClientAvailSection() {
  return (
    <NexusProvider>
      <DynamicBridgeWidget />
      <DynamicTransferWidget />
      <DynamicBridgeAndExecuteWidget />
    </NexusProvider>
  );
}
