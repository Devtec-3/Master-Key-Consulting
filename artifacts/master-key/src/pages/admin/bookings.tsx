import { motion } from "framer-motion";
import { useListBookings, useUpdateBooking, getListBookingsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const STATUS_OPTIONS = ["new", "contacted", "completed"];

const STATUS_COLORS: Record<string, string> = {
  new: "bg-primary/10 text-primary border border-primary/30",
  contacted: "bg-blue-50 text-blue-700 border border-blue-200",
  completed: "bg-green-50 text-green-700 border border-green-200",
};

export default function AdminBookings() {
  const { data: bookings, isLoading } = useListBookings();
  const updateBooking = useUpdateBooking();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  function handleStatusChange(id: number, status: string) {
    updateBooking.mutate({ id, data: { status } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
        toast({ title: "Status updated" });
      },
    });
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-[#0A0A0A]">Bookings</h1>
        <p className="text-muted-foreground mt-1">All service booking requests from the website.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
      ) : (bookings ?? []).length === 0 ? (
        <div className="bg-white border border-border p-16 text-center text-muted-foreground">
          <p className="font-heading text-xl">No bookings yet</p>
          <p className="mt-2 text-sm">Bookings submitted through the website will appear here.</p>
        </div>
      ) : (
        <div className="bg-white border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-[#F5F5F5]">
                {["Name", "Phone", "Email", "Service", "Location", "Preferred Date", "Submitted", "Status"].map((h) => (
                  <th key={h} className="text-left p-4 font-label text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(bookings ?? []).slice().reverse().map((booking, i) => (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border hover:bg-[#F5F5F5] transition-colors"
                  data-testid={`booking-row-${booking.id}`}
                >
                  <td className="p-4 font-medium text-[#0A0A0A] whitespace-nowrap">{booking.fullName}</td>
                  <td className="p-4 text-muted-foreground whitespace-nowrap">
                    <a href={`tel:${booking.phone}`} className="hover:text-primary">{booking.phone}</a>
                  </td>
                  <td className="p-4 text-muted-foreground max-w-[160px] truncate">{booking.email}</td>
                  <td className="p-4 text-muted-foreground max-w-[180px] truncate">{booking.serviceType}</td>
                  <td className="p-4 text-muted-foreground whitespace-nowrap">{booking.location}</td>
                  <td className="p-4 text-muted-foreground whitespace-nowrap">{booking.preferredDate}</td>
                  <td className="p-4 text-muted-foreground whitespace-nowrap">
                    {new Date(booking.createdAt).toLocaleDateString("en-NG")}
                  </td>
                  <td className="p-4">
                    <Select
                      defaultValue={booking.status}
                      onValueChange={(v) => handleStatusChange(booking.id, v)}
                    >
                      <SelectTrigger className={`w-32 text-xs font-label uppercase tracking-wider rounded-none border-0 ${STATUS_COLORS[booking.status] ?? ""}`} data-testid={`select-status-${booking.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s} value={s} className="font-label text-xs uppercase tracking-wider">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
