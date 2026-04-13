"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchAPI } from "@/lib/api";
import DashboardHeading from "./_components/common/DashboardHeading";
import ProfileCard from "./_components/profile/ProfileCard";
import ProfilePersonalInfoCard from "./_components/profile/ProfilePersonalInfoCard";
import EditProfileButton from "./_components/common/EditProfileButton";

function formatClientLocation(s) {
  if (!s) return "—";
  const parts = [s.city, s.state, s.countryName].filter(
    (p) => typeof p === "string" && p.trim(),
  );
  return parts.length ? parts.join(", ") : "—";
}

function formatJoinDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `Joined ${d.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
}

export default function DashboardProfileView() {
  const { isAuthenticated, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setProfile(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAPI("/experts/client/me", undefined, "GET");
      const snap = data?.client_snapshot;
      if (snap && typeof snap === "object") {
        setProfile(snap);
      } else {
        setError("Could not load profile.");
        setProfile(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load profile.");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleProfileSaved = useCallback(
    (next) => {
      if (next && typeof next === "object") {
        setProfile(next);
      }
      refreshUser?.();
    },
    [refreshUser],
  );

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <DashboardHeading text="Your Profile" />
        <p className="text-sm text-gray-600">
          Log in to view your profile and dashboard.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <DashboardHeading text="Your Profile" />
        </div>
        <p className="text-sm text-gray-500">Loading your profile…</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <DashboardHeading text="Your Profile" />
        </div>
        <p className="text-sm text-red-600">{error || "Something went wrong."}</p>
        <button
          type="button"
          onClick={loadProfile}
          className="text-sm font-semibold text-[#357200] underline"
        >
          Retry
        </button>
      </div>
    );
  }

  const imageSrc =
    typeof profile.profilePhoto === "string" && profile.profilePhoto.trim()
      ? profile.profilePhoto.trim()
      : null;
  const bio =
    typeof profile.notes === "string" && profile.notes.trim()
      ? profile.notes.trim()
      : typeof profile.goal === "string" && profile.goal.trim()
        ? profile.goal.trim()
        : "Add a short bio in Edit profile.";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <DashboardHeading text="Your Profile" />
        <EditProfileButton profile={profile} onProfileSaved={handleProfileSaved} />
      </div>
      <ProfileCard
        imageSrc={imageSrc}
        name={profile.name || "—"}
        bio={bio}
        location={formatClientLocation(profile)}
        joinDate={formatJoinDate(profile.createdAt)}
        isVerified={Boolean(profile.isVerified)}
      />
      <ProfilePersonalInfoCard
        fullName={profile.name || "—"}
        email={profile.email || "—"}
        mobileContact={profile.mobileNumber || "—"}
        baseLocation={formatClientLocation(profile)}
      />
    </div>
  );
}
