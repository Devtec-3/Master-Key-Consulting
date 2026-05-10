import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { useListBlogPosts } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import blog1 from "@/assets/images/blog-1.png";
import blog2 from "@/assets/images/blog-2.png";

export default function Blog() {
  useSEO({
    title: "Field Updates & Geological Insights — Blog",
    description: "Explore technical articles, field updates, and geological insights from Master Key Consulting's team of geoscientists and engineers working across Nigeria.",
  });

  const { data: posts, isLoading } = useListBlogPosts();
  const [search, setSearch] = useState("");

  const filtered = (posts ?? []).filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #CC0000 0, #CC0000 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }} />
        <div className="relative container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
            <span className="font-label text-accent text-sm uppercase tracking-[0.3em]">Field Updates & Insights</span>
            <h1 className="font-heading font-black text-5xl md:text-7xl text-white mt-2">Our Blog</h1>
            <p className="text-gray-400 text-xl mt-4 max-w-2xl mx-auto">
              Technical insights, field reports, and geological knowledge from our team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search */}
      <section className="py-8 bg-white border-b border-border">
        <div className="container mx-auto px-4 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-blog-search"
            />
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24 bg-[#F5F5F5] min-h-[60vh]" data-testid="section-blog-list">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              <p className="font-heading text-2xl">No articles found</p>
              {search && <p className="mt-2">Try a different search term.</p>}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="bg-white group"
                  data-testid={`blog-card-${post.id}`}
                >
                  <div className="h-52 overflow-hidden">
                    <img
                      src={post.coverImageUrl ?? (i % 2 === 0 ? blog1 : blog2)}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(post.tags ?? []).slice(0, 2).map((tag) => (
                        <span key={tag} className="bg-[#F5F5F5] text-primary text-xs font-label uppercase tracking-wider px-2 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-muted-foreground text-xs mb-2">
                      {new Date(post.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    <h2 className="font-heading font-bold text-xl text-[#0A0A0A] mb-4 leading-tight group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {post.content.replace(/[#*\n]/g, " ").substring(0, 150)}...
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-primary font-bold text-sm uppercase tracking-wider hover:text-accent flex items-center gap-1 transition-colors"
                      data-testid={`link-blog-read-${post.id}`}
                    >
                      Read More <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
