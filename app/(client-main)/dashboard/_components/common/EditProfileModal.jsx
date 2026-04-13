"use client";

import * as React from "react";
import { Dialog } from "radix-ui";
import { Camera, SquarePen, User, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { fetchAPI, fetchMultipart } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import AddressRegionFields from "@/components/experts/AddressRegionFields";
import { addressFromStoredLocation } from "@/lib/addressRegionUtils";

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
    "disabled:cursor-not-allowed disabled:opacity-60",
    extra,
  );
}

export default function EditProfileModal({
  open,
  onOpenChange,
  profile,
  onProfileSaved,
}) {
  const { refreshUser } = useAuth();
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [address, setAddress] = React.useState(() =>
    addressFromStoredLocation({}),
  );
  const [notes, setNotes] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [photoWorking, setPhotoWorking] = React.useState(false);
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    if (!open || !profile) return;
    setFullName(typeof profile.name === "string" ? profile.name : "");
    setEmail(typeof profile.email === "string" ? profile.email : "");
    setAddress(
      addressFromStoredLocation({
        countryName: profile.countryName,
        state: profile.state,
        city: profile.city,
        pincode: profile.pincode,
      }),
    );
    setNotes(typeof profile.notes === "string" ? profile.notes : "");
  }, [open, profile]);

  const persistClientSnapshot = React.useCallback(
    async (snap) => {
      if (!snap || typeof snap !== "object") return false;
      localStorage.setItem("client_data", JSON.stringify(snap));
      onProfileSaved?.(snap);
      await refreshUser?.();
      return true;
    },
    [onProfileSaved, refreshUser],
  );

  const photoUrl =
    profile &&
    typeof profile.profilePhoto === "string" &&
    profile.profilePhoto.trim()
      ? profile.profilePhoto.trim()
      : null;

  const handlePhotoFile = React.useCallback(
    async (file) => {
      if (!profile || !file) return;
      const okTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!okTypes.includes(file.type)) {
        toast.error("Please choose a JPG, PNG, WebP, or GIF image.");
        return;
      }
      const maxBytes = 12 * 1024 * 1024;
      if (file.size > maxBytes) {
        toast.error("Image must be 12 MB or smaller.");
        return;
      }
      setPhotoWorking(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const data = await fetchMultipart("/experts/client/profile-photo", fd);
        const snap = data?.client_snapshot;
        if (await persistClientSnapshot(snap)) {
          toast.success("Profile photo updated.");
        } else {
          toast.error("Could not update profile photo.");
        }
      } catch (e) {
        toast.error(
          e instanceof Error && e.message ? e.message : "Upload failed.",
        );
      } finally {
        setPhotoWorking(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [profile, persistClientSnapshot],
  );

  const handleRemovePhoto = React.useCallback(async () => {
    if (!profile || !photoUrl) return;
    setPhotoWorking(true);
    try {
      const data = await fetchAPI(
        "/experts/client/me",
        { profilePhoto: "" },
        "PATCH",
      );
      const snap = data?.client_snapshot;
      if (await persistClientSnapshot(snap)) {
        toast.success("Profile photo removed.");
      } else {
        toast.error("Could not remove profile photo.");
      }
    } catch (e) {
      toast.error(
        e instanceof Error && e.message ? e.message : "Could not remove photo.",
      );
    } finally {
      setPhotoWorking(false);
    }
  }, [profile, photoUrl, persistClientSnapshot]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const data = await fetchAPI(
        "/experts/client/me",
        {
          name: fullName.trim(),
          email: email.trim(),
          notes: notes.trim(),
          city: address.city.trim(),
          state: address.state.trim(),
          pincode: address.zipCode.trim(),
          countryName: address.country.trim(),
        },
        "PATCH",
      );
      const snap = data?.client_snapshot;
      if (snap && typeof snap === "object") {
        localStorage.setItem("client_data", JSON.stringify(snap));
        onProfileSaved?.(snap);
        await refreshUser?.();
        toast.success("Profile updated.");
        onOpenChange?.(false);
      } else {
        toast.error("Could not update profile.");
      }
    } catch (e) {
      toast.error(
        e instanceof Error && e.message
          ? e.message
          : "Could not update profile.",
      );
    } finally {
      setSaving(false);
    }
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
            Update your profile details and summary.
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
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  tabIndex={-1}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handlePhotoFile(f);
                  }}
                />
                <div className="relative">
                  <div
                    className={cn(
                      "relative flex size-28 items-center justify-center overflow-hidden rounded-full sm:size-32",
                      "ring-2 ring-[#70C136] ring-offset-2 ring-offset-white",
                      !photoUrl && "bg-[#70C136]",
                    )}
                  >
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={`${profile?.name || "User"} profile photo`}
                        className="size-full object-cover"
                      />
                    ) : (
                      <User
                        className="size-14 text-white sm:size-16"
                        strokeWidth={2}
                        aria-hidden
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    disabled={photoWorking || !profile}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 flex size-9 items-center justify-center rounded-full bg-[#70C136] text-white shadow-md ring-[3px] ring-white",
                      "transition-opacity hover:opacity-90",
                      (photoWorking || !profile) &&
                        "cursor-not-allowed opacity-60 hover:opacity-60",
                    )}
                    aria-label="Upload profile photo"
                    title="Upload profile photo"
                  >
                    <Camera className="size-4" strokeWidth={2} />
                  </button>
                </div>
                {photoUrl ? (
                  <button
                    type="button"
                    disabled={photoWorking}
                    onClick={() => void handleRemovePhoto()}
                    className="mt-3 text-xs font-bold uppercase tracking-wider text-red-600 underline-offset-2 hover:text-red-700 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Remove photo
                  </button>
                ) : null}
              </div>

              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-6">
                <div>
                  <FieldLabel>Full Name</FieldLabel>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={fieldInputClass()}
                    autoComplete="name"
                  />
                </div>
                <div>
                  <FieldLabel>Email Address</FieldLabel>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={fieldInputClass()}
                    autoComplete="email"
                  />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel>Mobile Contact</FieldLabel>
                  <input
                    type="tel"
                    value={
                      profile && typeof profile.mobileNumber === "string"
                        ? profile.mobileNumber
                        : ""
                    }
                    readOnly
                    disabled
                    className={fieldInputClass()}
                    autoComplete="tel"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Mobile is verified at sign-up. Contact support to change it.
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel>Location</FieldLabel>
                  <div className="mt-2">
                    <AddressRegionFields
                      address={address}
                      onAddressChange={(patch) =>
                        setAddress((a) => ({ ...a, ...patch }))
                      }
                      errors={{}}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <FieldLabel>Professional Profile Summary</FieldLabel>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                disabled={saving || !profile}
                className="h-auto rounded-xl bg-[#6AB039] px-6 py-3 font-lato text-sm font-black uppercase tracking-wider text-white hover:bg-[#5a9a31] disabled:opacity-60"
                onClick={handleSave}
              >
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </footer>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
