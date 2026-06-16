import { Github, Linkedin, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireRole } from "@/lib/authz";

const highlights = [
  "advanced catalog search",
  "role based access",
  "borrowing workflow",
  "reservation queue",
  "fine calculation",
  "audit log",
  "reports and export",
  "migration from React and Flask",
];

export default async function DeveloperPage() {
  await requireRole(["ADMIN", "LIBRARIAN", "MEMBER"]);

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Developer" title="Muh. Rinaldi Ruslan" description="Full-Stack Developer for UrLibrary Nexus." />
      <section className="rounded-lg border border-border bg-surface p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-lg font-semibold text-ink">Project profile</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Github className="h-4 w-4 text-primary" />
                <a className="font-medium text-ink" href="https://github.com/xebec51/UrLibrary">github.com/xebec51/UrLibrary</a>
              </div>
              <div className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-primary" />
                <a className="font-medium text-ink" href="https://www.linkedin.com/in/rinaldiruslan">linkedin.com/in/rinaldiruslan</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a className="font-medium text-ink" href="mailto:rinaldi.ruslan51@gmail.com">rinaldi.ruslan51@gmail.com</a>
              </div>
            </dl>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-ink">Engineering highlights</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {highlights.map((item) => (
                <Badge key={item} tone="primary">
                  {item}
                </Badge>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Next.js", "TypeScript", "Prisma", "PostgreSQL", "NextAuth", "Tailwind CSS", "Zod", "Recharts", "XLSX"].map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
