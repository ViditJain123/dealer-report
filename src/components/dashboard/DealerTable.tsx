import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeviceActions } from "@/components/dashboard/DeviceActions";
import type { DealerDeviceStatus } from "@/lib/dealer-auth/devices";
import type { Dealer } from "@/lib/supabase/types";

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** The device cell for one dealer row — bound device, pending request, or none. */
function DeviceCell({
  dealerId,
  status,
}: {
  dealerId: string;
  status: DealerDeviceStatus | undefined;
}) {
  if (status?.pending) {
    return (
      <div className="flex flex-col items-start gap-1.5">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Change requested</Badge>
          <span className="text-caption text-muted-foreground">
            {status.pending.deviceLabel || "Unknown device"}
          </span>
        </div>
        <DeviceActions dealerId={dealerId} variant="pending" />
      </div>
    );
  }

  if (status?.active) {
    return (
      <div className="flex flex-col items-start gap-1.5">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Bound</Badge>
          <span className="text-caption text-muted-foreground">
            {status.active.deviceLabel || "Unknown device"}
          </span>
        </div>
        <DeviceActions dealerId={dealerId} variant="active" />
      </div>
    );
  }

  return <span className="text-muted-foreground">No device yet</span>;
}

/**
 * Read-only list of a distributor's dealers, with each dealer's device-binding
 * status and the approve / reject / reset controls.
 */
export function DealerTable({
  dealers,
  deviceStatus,
}: {
  dealers: Dealer[];
  deviceStatus: Map<string, DealerDeviceStatus>;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Dealer name</TableHead>
            <TableHead>Dealer code</TableHead>
            <TableHead>Phone number</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Added</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dealers.map((dealer) => (
            <TableRow key={dealer.id}>
              <TableCell className="font-medium text-foreground">
                {dealer.dealer_name}
              </TableCell>
              <TableCell>
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-caption text-foreground">
                  {dealer.dealer_code}
                </code>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {dealer.phone_number}
              </TableCell>
              <TableCell className="align-top">
                <DeviceCell dealerId={dealer.id} status={deviceStatus.get(dealer.id)} />
              </TableCell>
              <TableCell className="align-top text-muted-foreground">
                {DATE_FORMAT.format(new Date(dealer.created_at))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
