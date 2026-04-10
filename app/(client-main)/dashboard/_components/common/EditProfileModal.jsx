"use client";

import * as React from "react";
import { Dialog } from "radix-ui";
import {
  Camera,
  Check,
  CloudSun,
  Moon,
  Plus,
  SquarePen,
  Sun,
  X,
  Wheat,
  Drumstick,
  MilkOff,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const DEFAULT_OBJECTIVES = ["Muscle Gain", "Flexibility", "Endurance"];

function FieldLabel({ children, className }) {
  return (
    <label
      className={cn(
        "text-xs font-semibold uppercase tracking-wider text-[#6b5d4f]",
        className,
      )}
    >
      {children}
    </label>
  );
}

function fieldInputClass(extra) {
  return cn(
    "mt-1.5 w-full rounded-lg border-0 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-900 outline-none",
    "placeholder:text-gray-400",
    "focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-0",
    extra,
  );
}

export default function EditProfileModal({ open, onOpenChange }) {
  const [objectives, setObjectives] = React.useState(
    () => new Set(DEFAULT_OBJECTIVES),
  );
  const [training, setTraining] = React.useState("morning");

  const toggleObjective = (label) => {
    setObjectives((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-[#3d5220]/25",
            "backdrop-blur-md supports-backdrop-filter:backdrop-blur-lg",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
        />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100%-1.5rem)] max-w-xl -translate-x-1/2 -translate-y-1/2",
            "max-h-[min(90vh,52rem)] overflow-hidden rounded-3xl bg-white shadow-2xl shadow-black/15",
            "outline-none data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          )}
        >
          <Dialog.Title className="sr-only">Edit Profile</Dialog.Title>
          <Dialog.Description className="sr-only">
            Update your profile details, goals, training schedule, and nutrition
            preferences.
          </Dialog.Description>

          <div className="flex max-h-[min(90vh,52rem)] flex-col">
            <header className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6 sm:py-5">
              <div className="flex items-center gap-3">
                <SquarePen
                  className="size-6 text-[#357200] sm:size-7"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="font-lato text-base font-black uppercase tracking-wide text-[#357200] sm:text-lg">
                  Edit Profile
                </span>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded-lg p-2 text-[#8a7d6b] transition-colors hover:bg-gray-100 hover:text-gray-900"
                  aria-label="Close"
                >
                  <X className="size-5" strokeWidth={2} />
                </button>
              </Dialog.Close>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-6">
              <div className="mx-auto flex max-w-md flex-col items-center">
                <div className="relative">
                  <div className="size-28 overflow-hidden rounded-full ring-2 ring-[#70C136] ring-offset-2 ring-offset-white sm:size-32">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80"
                      alt=""
                      className="size-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    className="absolute -bottom-0.5 -right-0.5 flex size-9 items-center justify-center rounded-full bg-[#70C136] text-white shadow-md ring-[3px] ring-white"
                    aria-label="Change profile photo"
                  >
                    <Camera className="size-4" strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-6">
                <div>
                  <FieldLabel>Full Name</FieldLabel>
                  <input
                    type="text"
                    defaultValue="Alex Rivera"
                    className={fieldInputClass()}
                    autoComplete="name"
                  />
                </div>
                <div>
                  <FieldLabel>Email Address</FieldLabel>
                  <input
                    type="email"
                    defaultValue="alex.rivera@kinetic.fit"
                    className={fieldInputClass()}
                    autoComplete="email"
                  />
                </div>
                <div>
                  <FieldLabel>Mobile Contact</FieldLabel>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 042-8831"
                    className={fieldInputClass()}
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <FieldLabel>Location</FieldLabel>
                  <input
                    type="text"
                    defaultValue="Santa Monica, CA"
                    className={fieldInputClass()}
                    autoComplete="address-level2"
                  />
                </div>
              </div>

              <div className="mt-6">
                <FieldLabel>Professional Profile Summary</FieldLabel>
                <textarea
                  defaultValue="Pushing boundaries since 2021. Focus on high-intensity metabolic conditioning and aesthetic symmetry."
                  rows={4}
                  className={cn(fieldInputClass(), "mt-1.5 resize-y")}
                />
              </div>
            </div>

            <footer className="flex shrink-0 items-center justify-end gap-4 border-t border-gray-200 px-5 py-4 sm:px-6">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="font-lato text-sm font-bold uppercase tracking-wider text-gray-500 transition-colors hover:text-gray-800"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <Button
                type="button"
                className="h-auto rounded-xl bg-[#6AB039] px-6 py-3 font-lato text-sm font-black uppercase tracking-wider text-white hover:bg-[#5a9a31]"
                onClick={() => onOpenChange?.(false)}
              >
                Save Changes
              </Button>
            </footer>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
