import { motion } from "framer-motion";
import { MapPin, X } from "lucide-react";
import { useState } from "react";
import { useListProjects } from "@workspace/api-client-react";
import type { Project } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

const filters = ["All", "Geophysical Survey", "Borehole Drilling", "Mineral Resources Exploration", "Geotechnical Investigation", "Mining"];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { data: projects, isLoading } = useListProjects(
    activeFilter !== "All" ? { serviceType: activeFilter } : {}
  );

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #CC0000 0, #CC0000 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }} />
        <div className="relative container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="font-label text-accent text-sm uppercase tracking-[0.3em]">Our Work</span>
            <h1 className="font-heading font-black text-5xl md:text-7xl text-white mt-2">Portfolio</h1>
            <p className="text-gray-400 text-xl mt-4 max-w-2xl mx-auto">
              A record of projects completed across Nigeria with precision and professionalism.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-[80px] z-30 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-4 scrollbar-hide">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`shrink-0 font-label text-xs uppercase tracking-wider px-5 py-2 transition-all duration-200 ${
                  activeFilter === f
                    ? "bg-primary text-white"
                    : "bg-[#F5F5F5] text-[#666] hover:bg-primary/10 hover:text-primary"
                }`}
                data-testid={`filter-${f.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-[#F5F5F5] min-h-[60vh]" data-testid="section-projects">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72" />
              ))}
            </div>
          ) : (projects ?? []).length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              <p className="font-heading text-2xl">No projects found</p>
              <p className="mt-2">Check back soon as we add more case studies.</p>
            </div>
          ) : (
            <motion.div
              className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
              initial="hidden"
              animate="show"
            >
              {(projects ?? []).map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(204,0,0,0.1)" }}
                  className="break-inside-avoid bg-white border border-border group cursor-pointer mb-6"
                  onClick={() => setSelectedProject(project)}
                  data-testid={`card-project-${project.id}`}
                >
                  <div className={`${i % 3 === 0 ? "h-64" : i % 3 === 1 ? "h-48" : "h-56"} bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] overflow-hidden relative`}>
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/30">
                        <span className="font-heading text-white/20 text-5xl font-black">MK</span>
                      </div>
                    )}
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-primary text-white text-xs font-label uppercase tracking-wider px-2 py-1">
                        {project.serviceType}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-accent text-xs font-label uppercase tracking-wider mb-2">
                      <MapPin className="w-3 h-3" />{project.location}
                    </div>
                    <h3 className="font-heading font-bold text-lg text-[#0A0A0A] group-hover:text-primary transition-colors leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">{project.date}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedProject(null)}
          data-testid="modal-project"
        >
          <motion.div
            className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-72 bg-gradient-to-br from-primary/20 to-secondary/30 overflow-hidden relative">
              {selectedProject.imageUrl ? (
                <img src={selectedProject.imageUrl} alt={selectedProject.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-heading text-white/30 text-8xl font-black">MK</span>
                </div>
              )}
              <button
                className="absolute top-4 right-4 bg-black/60 text-white p-2 hover:bg-primary transition-colors"
                onClick={() => setSelectedProject(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-primary text-white text-xs font-label uppercase tracking-wider px-3 py-1">{selectedProject.serviceType}</span>
                {selectedProject.featured && (
                  <span className="bg-accent text-black text-xs font-label uppercase tracking-wider px-3 py-1">Featured</span>
                )}
              </div>
              <h2 className="font-heading font-bold text-3xl text-[#0A0A0A] mb-2">{selectedProject.title}</h2>
              <div className="flex items-center gap-2 text-accent text-sm font-label uppercase tracking-wider mb-6">
                <MapPin className="w-4 h-4" />{selectedProject.location} · {selectedProject.date}
              </div>
              <p className="text-[#1A1A1A] leading-relaxed">{selectedProject.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
