import { Zap, Users, Briefcase, CheckCircle, ArrowRight } from "lucide-react";
import AppCard from "../../components/ui/AppCard";
import { AppButtonLink } from "../../components/ui/AppButton";

const features = [
  {
    icon: Zap,
    title: "Fast Applications",
    description: "Apply to jobs in seconds with your saved profile",
  },
  {
    icon: Users,
    title: "Smart Matching",
    description: "Get matched with opportunities tailored to your skills",
  },
  {
    icon: Briefcase,
    title: "Diverse Roles",
    description: "Explore thousands of jobs from startups to enterprises",
  },
  {
    icon: CheckCircle,
    title: "Fair Process",
    description: "Transparent hiring process with real feedback",
  },
];

function Home() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,#f3f0ff,transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center md:py-32">
          <p className="mb-4 inline-flex items-center rounded-full bg-brand-light px-4 py-1.5 text-sm font-medium text-brand">
            AI-powered hiring platform
          </p>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
            Find your next great opportunity
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
            QuickHire connects talented job seekers with amazing employers through
            a modern, transparent hiring experience.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <AppButtonLink to="/jobs" size="lg">
              Browse Jobs
              <ArrowRight className="h-4 w-4" />
            </AppButtonLink>
            <AppButtonLink to="/register" variant="secondary" size="lg">
              Get Started
            </AppButtonLink>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold text-slate-900">
              Why choose QuickHire?
            </h2>
            <p className="mt-4 text-sm text-slate-500">
              Built for candidates and recruiters who expect a premium experience.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <AppCard key={feature.title}>
                <feature.icon className="mb-4 h-8 w-8 text-brand" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500">{feature.description}</p>
              </AppCard>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Ready to get hired?
          </h2>
          <p className="text-sm text-slate-500 mb-10">
            Browse thousands of job opportunities and start your career journey
            today.
          </p>
          <AppButtonLink to="/jobs" size="lg">
            Explore Jobs Now
          </AppButtonLink>
        </div>
      </section>
    </div>
  );
}

export default Home;
