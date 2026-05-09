import { motion } from "framer-motion";
import { Check, Trash2, Star } from "lucide-react";
import { useListAllReviews, useUpdateReview, useDeleteReview, getListAllReviewsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function AdminReviews() {
  const { data: reviews, isLoading } = useListAllReviews();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  function handleApprove(id: number) {
    updateReview.mutate({ id, data: { approved: true } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAllReviewsQueryKey() });
        toast({ title: "Review approved" });
      },
    });
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this review?")) return;
    deleteReview.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAllReviewsQueryKey() });
        toast({ title: "Review deleted" });
      },
    });
  }

  const pending = (reviews ?? []).filter(r => !r.approved);
  const approved = (reviews ?? []).filter(r => r.approved);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-[#0A0A0A]">Reviews</h1>
        <p className="text-muted-foreground mt-1">Approve or remove client reviews.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}</div>
      ) : (
        <>
          {/* Pending */}
          {pending.length > 0 && (
            <div className="mb-10">
              <h2 className="font-label text-xs uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
                <span className="bg-primary text-white text-xs px-2 py-0.5">{pending.length}</span>
                Pending Approval
              </h2>
              <div className="space-y-3">
                {pending.map((review, i) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-white border border-primary/30 p-6"
                    data-testid={`review-pending-${review.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-label font-bold text-sm uppercase tracking-wider text-[#0A0A0A]">{review.name}</span>
                          <span className="text-muted-foreground text-xs">{review.location}</span>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star key={j} className={`w-3.5 h-3.5 ${j < review.rating ? "fill-accent text-accent" : "text-gray-200"}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-[#1A1A1A] text-sm italic mb-2">"{review.comment}"</p>
                        <p className="text-primary text-xs font-label">{review.service}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button size="sm" onClick={() => handleApprove(review.id)} className="bg-green-600 hover:bg-green-700 text-white rounded-none" data-testid={`btn-approve-${review.id}`}>
                          <Check className="w-4 h-4 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(review.id)} className="rounded-none text-destructive border-destructive/30" data-testid={`btn-delete-review-${review.id}`}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Approved */}
          <div>
            <h2 className="font-label text-xs uppercase tracking-wider text-muted-foreground mb-4">
              Approved Reviews ({approved.length})
            </h2>
            {approved.length === 0 ? (
              <p className="text-muted-foreground text-sm">No approved reviews yet.</p>
            ) : (
              <div className="space-y-3">
                {approved.map((review, i) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-white border border-border p-5 flex items-start gap-4 group"
                    data-testid={`review-approved-${review.id}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-label font-bold text-sm uppercase tracking-wider text-[#0A0A0A]">{review.name}</span>
                        <span className="text-muted-foreground text-xs">{review.location}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star key={j} className={`w-3 h-3 ${j < review.rating ? "fill-accent text-accent" : "text-gray-200"}`} />
                          ))}
                        </div>
                        <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-label uppercase tracking-wider px-2 py-0.5">Approved</span>
                      </div>
                      <p className="text-muted-foreground text-sm italic">"{review.comment.substring(0, 120)}..."</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(review.id)}
                      className="opacity-0 group-hover:opacity-100 rounded-none text-destructive border-destructive/30 transition-opacity"
                      data-testid={`btn-delete-approved-${review.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
