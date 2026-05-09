import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, X, Eye, EyeOff } from "lucide-react";
import { useListAllBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost, getListAllBlogPostsQueryKey } from "@workspace/api-client-react";
import type { BlogPost } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const blogSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(20),
  coverImageUrl: z.string().optional(),
  tags: z.string().optional(),
  published: z.boolean().default(false),
});

type BlogFormData = z.infer<typeof blogSchema>;

export default function AdminBlog() {
  const { data: posts, isLoading } = useListAllBlogPosts();
  const createBlogPost = useCreateBlogPost();
  const updateBlogPost = useUpdateBlogPost();
  const deleteBlogPost = useDeleteBlogPost();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: { title: "", content: "", coverImageUrl: "", tags: "", published: false },
  });

  function openNew() {
    setEditing(null);
    form.reset({ title: "", content: "", coverImageUrl: "", tags: "", published: false });
    setShowForm(true);
  }

  function openEdit(p: BlogPost) {
    setEditing(p);
    form.reset({
      title: p.title,
      content: p.content,
      coverImageUrl: p.coverImageUrl ?? "",
      tags: (p.tags ?? []).join(", "),
      published: p.published,
    });
    setShowForm(true);
  }

  function onSubmit(data: BlogFormData) {
    const payload = {
      title: data.title,
      content: data.content,
      coverImageUrl: data.coverImageUrl || undefined,
      tags: data.tags ? data.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      published: data.published,
    };
    if (editing) {
      updateBlogPost.mutate({ id: editing.id, data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListAllBlogPostsQueryKey() });
          toast({ title: "Post updated" });
          setShowForm(false);
        },
      });
    } else {
      createBlogPost.mutate({ data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListAllBlogPostsQueryKey() });
          toast({ title: "Post created" });
          setShowForm(false);
        },
      });
    }
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this post?")) return;
    deleteBlogPost.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAllBlogPostsQueryKey() });
        toast({ title: "Post deleted" });
      },
    });
  }

  function handleTogglePublish(post: BlogPost) {
    updateBlogPost.mutate({ id: post.id, data: { published: !post.published } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAllBlogPostsQueryKey() });
        toast({ title: post.published ? "Post unpublished" : "Post published" });
      },
    });
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-3xl text-[#0A0A0A]">Blog Posts</h1>
          <p className="text-muted-foreground mt-1">Write and manage your field updates and articles.</p>
        </div>
        <Button onClick={openNew} className="bg-primary hover:bg-secondary text-white font-bold uppercase tracking-wider rounded-none" data-testid="btn-new-post">
          <Plus className="w-4 h-4 mr-2" /> New Post
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" data-testid="modal-blog-form">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-heading font-bold text-xl">{editing ? "Edit Post" : "New Blog Post"}</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-label text-xs uppercase tracking-wider">Title *</FormLabel>
                      <FormControl><Input {...field} data-testid="input-post-title" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="content" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-label text-xs uppercase tracking-wider">Content * (Markdown supported)</FormLabel>
                      <FormControl><Textarea rows={10} {...field} data-testid="textarea-post-content" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="coverImageUrl" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-label text-xs uppercase tracking-wider">Cover Image URL</FormLabel>
                        <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="tags" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-label text-xs uppercase tracking-wider">Tags (comma-separated)</FormLabel>
                        <FormControl><Input placeholder="geology, Nigeria, drilling" {...field} /></FormControl>
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="published" render={({ field }) => (
                    <FormItem className="flex items-center gap-3">
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-published" /></FormControl>
                      <FormLabel className="font-label text-xs uppercase tracking-wider !mt-0">Published</FormLabel>
                    </FormItem>
                  )} />
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={createBlogPost.isPending || updateBlogPost.isPending} className="bg-primary hover:bg-secondary text-white font-bold uppercase tracking-wider rounded-none flex-1" data-testid="btn-save-post">
                      {editing ? "Update Post" : "Create Post"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="rounded-none">Cancel</Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : (posts ?? []).length === 0 ? (
        <div className="bg-white border border-border p-16 text-center text-muted-foreground">
          <p className="font-heading text-xl">No posts yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(posts ?? []).slice().reverse().map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white border border-border p-5 flex items-center gap-4 group"
              data-testid={`post-row-${post.id}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-label font-bold text-sm uppercase tracking-wider text-[#0A0A0A] truncate">{post.title}</h3>
                  <span className={`text-xs font-label uppercase tracking-wider px-2 py-0.5 shrink-0 ${post.published ? "bg-green-50 text-green-700 border border-green-200" : "bg-[#F5F5F5] text-muted-foreground border border-border"}`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs mt-1">
                  {new Date(post.createdAt).toLocaleDateString("en-NG")} · /{post.slug}
                </p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" variant="outline" onClick={() => handleTogglePublish(post)} className="rounded-none" data-testid={`btn-toggle-publish-${post.id}`}>
                  {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button size="sm" variant="outline" onClick={() => openEdit(post)} className="rounded-none" data-testid={`btn-edit-post-${post.id}`}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(post.id)} className="rounded-none text-destructive hover:text-destructive border-destructive/30" data-testid={`btn-delete-post-${post.id}`}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
