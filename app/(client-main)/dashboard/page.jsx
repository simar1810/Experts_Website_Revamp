import DashboardHeading from "./_components/common/DashboardHeading";
import ProfileCard from "./_components/profile/ProfileCard";
import ProfilePersonalInfoCard from "./_components/profile/ProfilePersonalInfoCard";
import EditProfileButton from "./_components/common/EditProfileButton";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <DashboardHeading text="Your Profile" />
        <EditProfileButton />
      </div>
      <ProfileCard
        imageSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80"
        name="Alex Rivera"
        bio="Pushing boundaries since 2021. Focus on high-intensity metabolic conditioning and aesthetic symmetry."
        location="Los Angeles, CA"
        joinDate="Joined March 2021"
        isVerified
      />
      <ProfilePersonalInfoCard
        fullName="Alex Rivera"
        email="alex.rivera@kinetic.fit"
        mobileContact="+1 (555) 042-8831"
        baseLocation="Santa Monica, CA"
      />
    </div>
  );
}
