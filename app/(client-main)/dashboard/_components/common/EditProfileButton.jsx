"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import EditProfileModal from "./EditProfileModal";

export default function EditProfileButton({ profile, onProfileSaved }) {
  const [open, setOpen] = React.useState(false);

  if (!profile) {
    return null;
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="font-lato cursor-pointer gap-2 bg-[#F9F9F9] px-6 py-5 text-sm font-bold tracking-wider text-[#357200] uppercase hover:bg-[#ececec]"
      >
        <span>Edit Profile</span>
        <ChevronRight className="size-5 shrink-0" />
      </Button>
      <EditProfileModal
        open={open}
        onOpenChange={setOpen}
        profile={profile}
        onProfileSaved={onProfileSaved}
      />
    </>
  );
}
