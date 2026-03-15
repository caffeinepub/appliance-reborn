import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart3,
  Check,
  ClipboardList,
  Loader2,
  LogIn,
  LogOut,
  MessageSquare,
  PencilLine,
  Plus,
  ShieldCheck,
  Star,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { BookingStatus } from "../backend.d";
import type { Booking, Testimonial } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddTestimonial,
  useDeleteBooking,
  useDeleteTestimonial,
  useGetBookingCounts,
  useGetBookings,
  useGetTestimonials,
  useIsCallerAdmin,
  useUpdateBookingStatus,
  useUpdateTestimonial,
} from "../hooks/useQueries";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const APPLIANCE_LABELS: Record<string, string> = {
  WashingMachine: "Washing Machine",
  Dryer: "Dryer",
  Dishwasher: "Dishwasher",
  Microwave: "Microwave",
  Chimney: "Chimney",
  HobChula: "Hob / Chula",
};

function StatCard({
  label,
  value,
  color,
}: { label: string; value: string | number; color: string }) {
  return (
    <Card className="border-border shadow-warm">
      <CardContent className="p-6">
        <p className="text-sm font-medium text-muted-foreground mb-1">
          {label}
        </p>
        <p className={`text-3xl font-display font-bold ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function TestimonialForm({
  initial,
  onSave,
  onCancel,
  isPending,
}: {
  initial?: Testimonial;
  onSave: (data: { author: string; content: string; rating: bigint }) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [author, setAuthor] = useState(initial?.author ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [rating, setRating] = useState(String(initial?.rating ?? 5));

  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label>Author Name</Label>
        <Input
          data-ocid="testimonial.input"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Customer name"
        />
      </div>
      <div className="space-y-2">
        <Label>Review</Label>
        <Textarea
          data-ocid="testimonial.textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Customer review…"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label>Rating (1–5)</Label>
        <Select value={rating} onValueChange={setRating}>
          <SelectTrigger data-ocid="testimonial.select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((r) => (
              <SelectItem key={r} value={String(r)}>
                {r} Star{r > 1 ? "s" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DialogFooter className="pt-2">
        <Button
          data-ocid="testimonial.cancel_button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          data-ocid="testimonial.save_button"
          disabled={!author || !content || isPending}
          onClick={() => onSave({ author, content, rating: BigInt(rating) })}
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {initial ? "Update" : "Add"} Testimonial
        </Button>
      </DialogFooter>
    </div>
  );
}

export default function AdminPage() {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const isLoggedIn = !!identity;

  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: counts, isLoading: countsLoading } = useGetBookingCounts();
  const { data: bookings, isLoading: bookingsLoading } = useGetBookings();
  const { data: testimonials, isLoading: testimonialsLoading } =
    useGetTestimonials();

  const updateStatus = useUpdateBookingStatus();
  const deleteBooking = useDeleteBooking();
  const addTestimonial = useAddTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();

  const [editTestimonial, setEditTestimonial] = useState<Testimonial | null>(
    null,
  );
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleStatusChange = async (
    booking: Booking,
    status: BookingStatus,
  ) => {
    try {
      await updateStatus.mutateAsync({ bookingId: booking.id, status });
      toast.success(`Booking marked as ${status}.`);
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleDeleteBooking = async (id: bigint) => {
    try {
      await deleteBooking.mutateAsync(id);
      toast.success("Booking deleted.");
    } catch {
      toast.error("Failed to delete booking.");
    }
  };

  const handleAddTestimonial = async (data: {
    author: string;
    content: string;
    rating: bigint;
  }) => {
    try {
      await addTestimonial.mutateAsync(data);
      toast.success("Testimonial added.");
      setAddOpen(false);
    } catch {
      toast.error("Failed to add testimonial.");
    }
  };

  const handleUpdateTestimonial = async (data: {
    author: string;
    content: string;
    rating: bigint;
  }) => {
    if (!editTestimonial) return;
    try {
      await updateTestimonial.mutateAsync({ id: editTestimonial.id, ...data });
      toast.success("Testimonial updated.");
      setEditOpen(false);
      setEditTestimonial(null);
    } catch {
      toast.error("Failed to update testimonial.");
    }
  };

  const handleDeleteTestimonial = async (id: bigint) => {
    try {
      await deleteTestimonial.mutateAsync(id);
      toast.success("Testimonial deleted.");
    } catch {
      toast.error("Failed to delete testimonial.");
    }
  };

  // Loading state
  if (isInitializing || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div data-ocid="admin.loading_state" className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm"
        >
          <Card className="border-border shadow-warm-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="font-display text-2xl">
                Admin Login
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                Sign in with Internet Identity to access the dashboard.
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                data-ocid="admin.primary_button"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                disabled={loginStatus === "logging-in"}
                onClick={() => login()}
              >
                {loginStatus === "logging-in" ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />{" "}
                    Connecting…
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 w-4 h-4" /> Sign In
                  </>
                )}
              </Button>
              <div className="mt-4 text-center">
                <a
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Back to website
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Logged in but not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="border-border shadow-warm max-w-sm w-full">
          <CardContent className="p-8 text-center">
            <div data-ocid="admin.error_state">
              <X className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h2 className="font-display text-xl font-bold mb-2">
                Access Denied
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Your account doesn't have admin privileges.
              </p>
              <Button
                data-ocid="admin.secondary_button"
                variant="outline"
                onClick={() => clear()}
              >
                <LogOut className="mr-2 w-4 h-4" /> Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-xs sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-foreground">
                Appliance<span className="text-primary">Fix</span>
              </span>
              <Badge className="ml-2 bg-amber-100 text-amber-700 border-amber-200">
                Admin
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <a
                data-ocid="admin.link"
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                View Site
              </a>
              <Button
                data-ocid="admin.secondary_button"
                variant="outline"
                size="sm"
                onClick={() => clear()}
              >
                <LogOut className="mr-1.5 w-4 h-4" /> Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <section className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-6">
            Dashboard
          </h1>
          {countsLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Bookings"
                value={Number(
                  (counts?.pending ?? 0n) +
                    (counts?.confirmed ?? 0n) +
                    (counts?.completed ?? 0n) +
                    (counts?.cancelled ?? 0n),
                )}
                color="text-foreground"
              />
              <StatCard
                label="Pending"
                value={Number(counts?.pending ?? 0)}
                color="text-yellow-600"
              />
              <StatCard
                label="Confirmed"
                value={Number(counts?.confirmed ?? 0)}
                color="text-blue-600"
              />
              <StatCard
                label="Completed"
                value={Number(counts?.completed ?? 0)}
                color="text-green-600"
              />
            </div>
          )}
        </section>

        {/* Tabs */}
        <Tabs defaultValue="bookings">
          <TabsList data-ocid="admin.tab" className="mb-6">
            <TabsTrigger
              data-ocid="admin.tab"
              value="bookings"
              className="gap-2"
            >
              <ClipboardList className="w-4 h-4" /> Bookings
            </TabsTrigger>
            <TabsTrigger
              data-ocid="admin.tab"
              value="testimonials"
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" /> Testimonials
            </TabsTrigger>
          </TabsList>

          {/* BOOKINGS TAB */}
          <TabsContent value="bookings">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" /> All Bookings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {bookingsLoading ? (
                  <div
                    data-ocid="admin.loading_state"
                    className="p-8 space-y-3"
                  >
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12" />
                    ))}
                  </div>
                ) : !bookings || bookings.length === 0 ? (
                  <div
                    data-ocid="admin.empty_state"
                    className="p-12 text-center text-muted-foreground"
                  >
                    <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="font-medium">No bookings yet</p>
                    <p className="text-sm">
                      Bookings submitted through the website will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table data-ocid="admin.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Appliance</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map((booking, idx) => (
                          <TableRow
                            key={String(booking.id)}
                            data-ocid={`admin.booking.row.${idx + 1}`}
                          >
                            <TableCell className="font-medium">
                              {booking.name}
                            </TableCell>
                            <TableCell>{booking.phone}</TableCell>
                            <TableCell>
                              {APPLIANCE_LABELS[booking.applianceType] ??
                                booking.applianceType}
                            </TableCell>
                            <TableCell>{booking.serviceType}</TableCell>
                            <TableCell>{booking.preferredDate}</TableCell>
                            <TableCell>
                              <Badge
                                className={`capitalize ${STATUS_COLORS[booking.status] ?? ""}`}
                                variant="outline"
                              >
                                {booking.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                {booking.status === BookingStatus.pending && (
                                  <Button
                                    data-ocid="admin.booking.confirm_button"
                                    size="sm"
                                    variant="outline"
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50 h-7 px-2"
                                    disabled={updateStatus.isPending}
                                    onClick={() =>
                                      handleStatusChange(
                                        booking,
                                        BookingStatus.confirmed,
                                      )
                                    }
                                  >
                                    <Check className="w-3.5 h-3.5 mr-1" />{" "}
                                    Confirm
                                  </Button>
                                )}
                                {booking.status === BookingStatus.confirmed && (
                                  <Button
                                    data-ocid="admin.booking.confirm_button"
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600 border-green-200 hover:bg-green-50 h-7 px-2"
                                    disabled={updateStatus.isPending}
                                    onClick={() =>
                                      handleStatusChange(
                                        booking,
                                        BookingStatus.completed,
                                      )
                                    }
                                  >
                                    <Check className="w-3.5 h-3.5 mr-1" />{" "}
                                    Complete
                                  </Button>
                                )}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      data-ocid="admin.booking.delete_button"
                                      size="sm"
                                      variant="outline"
                                      className="text-destructive border-red-200 hover:bg-red-50 h-7 px-2"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent data-ocid="admin.dialog">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete Booking?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete{" "}
                                        {booking.name}'s booking. This action
                                        cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel data-ocid="admin.cancel_button">
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        data-ocid="admin.confirm_button"
                                        className="bg-destructive text-destructive-foreground"
                                        onClick={() =>
                                          handleDeleteBooking(booking.id)
                                        }
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TESTIMONIALS TAB */}
          <TabsContent value="testimonials">
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />{" "}
                  Testimonials
                </CardTitle>
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                  <DialogTrigger asChild>
                    <Button
                      data-ocid="admin.testimonial.open_modal_button"
                      size="sm"
                      className="bg-primary text-white"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Testimonial
                    </Button>
                  </DialogTrigger>
                  <DialogContent data-ocid="admin.testimonial.dialog">
                    <DialogHeader>
                      <DialogTitle className="font-display">
                        Add Testimonial
                      </DialogTitle>
                    </DialogHeader>
                    <TestimonialForm
                      onSave={handleAddTestimonial}
                      onCancel={() => setAddOpen(false)}
                      isPending={addTestimonial.isPending}
                    />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-0">
                {testimonialsLoading ? (
                  <div
                    data-ocid="admin.loading_state"
                    className="p-8 space-y-3"
                  >
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20" />
                    ))}
                  </div>
                ) : !testimonials || testimonials.length === 0 ? (
                  <div
                    data-ocid="admin.testimonials.empty_state"
                    className="p-12 text-center text-muted-foreground"
                  >
                    <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="font-medium">No testimonials yet</p>
                    <p className="text-sm">
                      Add a testimonial to display on the landing page.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {testimonials.map((t, idx) => (
                      <div
                        key={String(t.id)}
                        data-ocid={`admin.testimonials.item.${idx + 1}`}
                        className="flex items-start gap-4 p-5"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-foreground">
                              {t.author}
                            </span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((si) => (
                                <Star
                                  key={`star-${si}`}
                                  className={`w-3.5 h-3.5 ${
                                    si <= Number(t.rating)
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-muted-foreground/30"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {t.content}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Dialog
                            open={editOpen && editTestimonial?.id === t.id}
                            onOpenChange={(open) => {
                              setEditOpen(open);
                              if (!open) setEditTestimonial(null);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                data-ocid="admin.testimonial.edit_button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditTestimonial(t);
                                  setEditOpen(true);
                                }}
                                className="h-8 px-2"
                              >
                                <PencilLine className="w-3.5 h-3.5" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent data-ocid="admin.testimonial.dialog">
                              <DialogHeader>
                                <DialogTitle className="font-display">
                                  Edit Testimonial
                                </DialogTitle>
                              </DialogHeader>
                              {editTestimonial && (
                                <TestimonialForm
                                  initial={editTestimonial}
                                  onSave={handleUpdateTestimonial}
                                  onCancel={() => {
                                    setEditOpen(false);
                                    setEditTestimonial(null);
                                  }}
                                  isPending={updateTestimonial.isPending}
                                />
                              )}
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                data-ocid="admin.testimonial.delete_button"
                                size="sm"
                                variant="outline"
                                className="text-destructive border-red-200 hover:bg-red-50 h-8 px-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent data-ocid="admin.dialog">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Testimonial?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Remove {t.author}'s review from the website.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel data-ocid="admin.cancel_button">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  data-ocid="admin.confirm_button"
                                  className="bg-destructive text-destructive-foreground"
                                  onClick={() => handleDeleteTestimonial(t.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
