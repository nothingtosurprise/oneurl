"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const steps = [
  { path: "/onboarding/username", label: "Username", step: 1 },
  { path: "/onboarding/avatar", label: "Profile", step: 2 },
  { path: "/onboarding/links", label: "Links", step: 3 },
  { path: "/onboarding/preview", label: "Preview", step: 4 },
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentStep = steps.findIndex((step) => step.path === pathname);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100">
      <div className="border-b-2 border-dashed border-zinc-200 bg-zinc-100/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="OneURL"
              width={128}
              height={128}
              className="h-12 w-12"
            />
            <h1 className="text-sm font-medium font-mono">OneURL</h1>
          </Link>
          <Button variant="ghost" size="sm" render={<Link href="/dashboard">Skip for now</Link>}>
            <Link href="/dashboard">Skip for now</Link>
          </Button>
        </div>
      </div>

      <div className="border-b-2 border-dashed border-zinc-200 bg-zinc-100/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              return (
                <div key={step.path} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                        isActive
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : isCompleted
                            ? "border-zinc-900 bg-zinc-900 text-white"
                            : "border-zinc-300 text-zinc-500"
                      }`}
                    >
                      {isCompleted ? (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <span className="text-xs font-medium">
                          {step.step}
                        </span>
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium ${
                        isActive
                          ? "text-zinc-900"
                          : "text-zinc-500"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`mx-2 h-0.5 flex-1 transition-colors ${
                        isCompleted
                          ? "bg-zinc-900"
                          : "bg-zinc-300"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center font-mono text-sm">{children}</div>
    </div>
  );
}

