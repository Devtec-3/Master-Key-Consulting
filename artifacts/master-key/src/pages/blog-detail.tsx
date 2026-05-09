import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Share2 } from "lucide-react";
import { SiWhatsapp, SiX } from "react-icons/si";
import { useGetBlogPost } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = useGetBlogPost(slug ?? "");
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="py-24 container mx-auto px-4 max-w-3xl">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-12 mb-4" />
        <Skeleton className="h-64 mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-4" />)}
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="py-24 container mx-auto px-4 text-center">
        <h1 className="font-heading font-bold text-4xl text-[#0A0A0A] mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-8">This article may have been removed or the link may be incorrect.</p>
        <Link href="/blog" className="text-primary font-bold uppercase tracking-wider hover:text-accent">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  function copyLink() {
    navigator.clipboard.writeText(pageUrl);
    toast({ title: "Link copied!", description: "The article link has been copied to your clipboard." });
  }

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/blog" className="flex items-center gap-2 text-accent text-sm font-label uppercase tracking-wider hover:text-white transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
            <div className="flex flex-wrap gap-2 mb-6">
              {(post.tags ?? []).map((tag) => (
                <span key={tag} className="bg-primary/20 border border-primary/40 text-accent text-xs font-label uppercase tracking-wider px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-heading font-black text-4xl md:text-6xl text-white leading-tight mb-6">
              {post.title}
            </h1>
            <div className="text-gray-400 text-sm font-label uppercase tracking-wider">
              {new Date(post.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })} · Master Key Consulting
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white" data-testid="section-blog-content">
        <div className="container mx-auto px-4 max-w-3xl">
          {post.coverImageUrl && (
            <motion.img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full h-72 md:h-96 object-cover mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}

          <motion.div
            className="prose prose-lg max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {post.content.split("\n\n").map((para, i) => {
              if (para.startsWith("## ")) {
                return (
                  <h2 key={i} className="font-heading font-bold text-2xl text-[#0A0A0A] mt-10 mb-4">
                    {para.replace("## ", "")}
                  </h2>
                );
              }
              if (para.startsWith("**") && para.endsWith("**")) {
                return (
                  <h3 key={i} className="font-label font-bold text-lg uppercase tracking-wider text-primary mt-8 mb-3">
                    {para.replace(/\*\*/g, "")}
                  </h3>
                );
              }
              return (
                <p key={i} className="text-[#1A1A1A] leading-relaxed mb-6">{para}</p>
              );
            })}
          </motion.div>

          {/* Share */}
          <div className="mt-16 pt-8 border-t border-border">
            <div className="font-label text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Share This Article
            </div>
            <div className="flex gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(post.title + " " + pageUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 text-sm font-label uppercase tracking-wider hover:bg-[#20b358] transition-colors"
                data-testid="btn-share-whatsapp"
              >
                <SiWhatsapp className="w-4 h-4" /> WhatsApp
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#1DA1F2] text-white px-4 py-2 text-sm font-label uppercase tracking-wider hover:bg-[#1a8cd8] transition-colors"
                data-testid="btn-share-twitter"
              >
                <SiX className="w-4 h-4" /> Twitter
              </a>
              <button
                onClick={copyLink}
                className="flex items-center gap-2 bg-[#F5F5F5] text-[#0A0A0A] px-4 py-2 text-sm font-label uppercase tracking-wider hover:bg-border transition-colors"
                data-testid="btn-copy-link"
              >
                <Copy className="w-4 h-4" /> Copy Link
              </button>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/blog" className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider hover:text-accent transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
