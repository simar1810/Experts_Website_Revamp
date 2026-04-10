import DashboardHeading from "../_components/common/DashboardHeading";
import ChatMessagesSection from "./_components/ChatMessagesSection";

export default function DashboardEnquiriesPage() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0">
        <DashboardHeading text="YOUR CHATS" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ChatMessagesSection />
      </div>
    </div>
  );
}
