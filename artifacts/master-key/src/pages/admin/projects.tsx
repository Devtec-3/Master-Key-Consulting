import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";
import { useListProjects, useCreateProject, useUpdateProject, useDeleteProject, getListProjectsQueryKey } from "@workspace/api-client-react";
import type { Project } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const SERVICES = [
  "Geophysical Survey",
  "Mineral Resources Exploration",
  "Mining",
  "Borehole Drilling",
  "Geotechnical Investigation",
  "Consultation",
];

const projectSchema = z.object({
  title: z.string().min(3),
  location: z.string().min(3),
  serviceType: z.string().min(1),
  description: z.string().min(10),
  date: z.string().min(3),
  imageUrl: z.string().optional(),
  featured: z.boolean().default(false),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function AdminProjects() {
  const { data: projects, isLoading } = useListProjects({});
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: { title: "", location: "", serviceType: "", description: "", date: "", imageUrl: "", featured: false },
  });

  function openNew() {
    setEditing(null);
    form.reset({ title: "", location: "", serviceType: "", description: "", date: "", imageUrl: "", featured: false });
    setShowForm(true);
  }

  function openEdit(p: Project) {
    setEditing(p);
    form.reset({
      title: p.title,
      location: p.location,
      serviceType: p.serviceType,
      description: p.description,
      date: p.date,
      imageUrl: p.imageUrl ?? "",
      featured: p.featured,
    });
    setShowForm(true);
  }

  function onSubmit(data: ProjectFormData) {
    const payload = { ...data, imageUrl: data.imageUrl || undefined };
    if (editing) {
      updateProject.mutate({ id: editing.id, data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
          toast({ title: "Project updated" });
          setShowForm(false);
        },
      });
    } else {
      createProject.mutate({ data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
          toast({ title: "Project created" });
          setShowForm(false);
        },
      });
    }
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this project?")) return;
    deleteProject.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        toast({ title: "Project deleted" });
      },
    });
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-3xl text-[#0A0A0A]">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your portfolio projects.</p>
        </div>
        <Button onClick={openNew} className="bg-primary hover:bg-secondary text-white font-bold uppercase tracking-wider rounded-none" data-testid="btn-new-project">
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" data-testid="modal-project-form">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-heading font-bold text-xl">{editing ? "Edit Project" : "New Project"}</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-label text-xs uppercase tracking-wider">Title *</FormLabel>
                      <FormControl><Input {...field} data-testid="input-project-title" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="location" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-label text-xs uppercase tracking-wider">Location *</FormLabel>
                        <FormControl><Input placeholder="Ilorin, Kwara State" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="date" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-label text-xs uppercase tracking-wider">Date *</FormLabel>
                        <FormControl><Input placeholder="March 2025" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="serviceType" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-label text-xs uppercase tracking-wider">Service Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl>
                        <SelectContent>{SERVICES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-label text-xs uppercase tracking-wider">Description *</FormLabel>
                      <FormControl><Textarea rows={4} {...field} data-testid="textarea-project-description" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-label text-xs uppercase tracking-wider">Image URL</FormLabel>
                      <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="featured" render={({ field }) => (
                    <FormItem className="flex items-center gap-3">
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-featured" /></FormControl>
                      <FormLabel className="font-label text-xs uppercase tracking-wider !mt-0">Featured on Homepage</FormLabel>
                    </FormItem>
                  )} />
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={createProject.isPending || updateProject.isPending} className="bg-primary hover:bg-secondary text-white font-bold uppercase tracking-wider rounded-none flex-1" data-testid="btn-save-project">
                      {editing ? "Update Project" : "Create Project"}
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
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : (projects ?? []).length === 0 ? (
        <div className="bg-white border border-border p-16 text-center text-muted-foreground">
          <p className="font-heading text-xl">No projects yet</p>
          <p className="mt-2 text-sm">Click "Add Project" to add your first portfolio entry.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(projects ?? []).slice().reverse().map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white border border-border p-5 flex items-center gap-4 group"
              data-testid={`project-row-${project.id}`}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/30 shrink-0 flex items-center justify-center">
                {project.imageUrl ? (
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white/30 font-heading font-black text-lg">MK</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-label font-bold text-sm uppercase tracking-wider text-[#0A0A0A] truncate">{project.title}</h3>
                  {project.featured && <Star className="w-4 h-4 text-accent fill-accent shrink-0" />}
                </div>
                <p className="text-muted-foreground text-xs mt-1">{project.serviceType} · {project.location} · {project.date}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" variant="outline" onClick={() => openEdit(project)} className="rounded-none" data-testid={`btn-edit-project-${project.id}`}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(project.id)} className="rounded-none text-destructive hover:text-destructive border-destructive/30" data-testid={`btn-delete-project-${project.id}`}>
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
