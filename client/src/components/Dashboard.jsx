import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeftRight,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Clock,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import Navbar from "./Navbar";

const stats = [
  {
    label: "Skills listed",
    value: "06",
    detail: "2 getting attention",
    icon: BookOpenCheck,
  },
  {
    label: "Active requests",
    value: "03",
    detail: "1 needs a reply",
    icon: ArrowLeftRight,
  },
  {
    label: "Exchanges done",
    value: "12",
    detail: "Keep the streak alive",
    icon: CheckCircle2,
  },
];

const suggestedSwaps = [
  {
    skill: "React components",
    match: "Portfolio review",
    person: "Aarav",
    time: "Today",
  },
  {
    skill: "Interview prep",
    match: "Figma basics",
    person: "Maya",
    time: "Tomorrow",
  },
  {
    skill: "Data structures",
    match: "Resume feedback",
    person: "Ishaan",
    time: "This week",
  },
];

const activity = [
  "Maya accepted your skill exchange request.",
  "Your React components skill was viewed 8 times.",
  "Aarav sent a new request for portfolio review.",
];

const Dashboard = () => {
  const { user } = useAuth();
  const firstName = user?.firstName || "there";

  return (
    <>
    <Navbar/>
      <main className="min-h-[calc(100vh-5rem)] bg-gray-950 text-white">
        <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
          <section className="border-b border-gray-800 pb-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-3 py-1.5 text-sm font-medium text-gray-300">
                  <Sparkles size={16} className="text-blue-600" />
                  {user?.credits ?? 0} credits ready to use
                </div>

                <h1 className="text-4xl font-bold text-white sm:text-5xl">
                  Welcome back, {firstName}!
                </h1>
                <p className="mt-4 max-w-xl text-lg text-gray-400">
                  Find the next useful exchange, answer open requests, and keep
                  your skills moving with people who want to learn.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/skills"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/60">
                  <Plus size={18} />
                  Add skill
                </Link>
                <Link
                  to="/requests"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/60">
                  <ArrowLeftRight size={18} />
                  View requests
                </Link>
              </div>
            </div>
          </section>

          <section className="grid gap-4 py-6 md:grid-cols-3">
            {stats.map(({ label, value, detail, icon: Icon }) => (
              <div
                key={label}
                className="rounded-lg border border-gray-800 bg-gray-900 p-5 shadow-lg shadow-blue-950/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-400">{label}</p>
                    <p className="mt-2 text-3xl font-bold text-white">
                      {value}
                    </p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-950 text-blue-600">
                    <Icon size={20} />
                  </span>
                </div>
                <p className="mt-4 text-sm text-gray-400">{detail}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-5 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Suggested swaps
                  </h2>
                  <p className="mt-1 text-sm text-gray-400">
                    Matches based on your listed skills and open requests.
                  </p>
                </div>
                <Users size={20} className="text-gray-400" />
              </div>

              <div className="space-y-3">
                {suggestedSwaps.map((swap) => (
                  <Link
                    key={`${swap.person}-${swap.skill}`}
                    to="/requests"
                    className="group flex items-center justify-between gap-4 rounded-lg border border-gray-800 bg-gray-900 p-4 transition hover:-translate-y-0.5 hover:border-gray-700 hover:bg-gray-800">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
                        <span>{swap.person}</span>
                        <span className="h-1 w-1 rounded-full bg-gray-700" />
                        <span>{swap.time}</span>
                      </div>
                      <p className="mt-2 text-base font-semibold text-white">
                        {swap.skill}
                      </p>
                      <p className="mt-1 text-sm text-gray-400">
                        Wants to exchange for {swap.match}
                      </p>
                    </div>
                    <ArrowRight
                      size={19}
                      className="shrink-0 text-gray-500 transition group-hover:translate-x-1 group-hover:text-blue-600"
                    />
                  </Link>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Recent activity
                  </h2>
                  <p className="mt-1 text-sm text-gray-400">
                    What changed since your last visit.
                  </p>
                </div>
                <Clock size={20} className="text-gray-400" />
              </div>

              <div className="rounded-lg border border-gray-800 bg-gray-900">
                {activity.map((item, index) => (
                  <div
                    key={item}
                    className={`flex gap-3 px-4 py-4 ${
                      index !== activity.length - 1
                        ? "border-b border-gray-800"
                        : ""
                    }`}>
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />
                    <p className="text-sm leading-6 text-gray-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
