import DashboardHeading from "../_components/common/DashboardHeading";
import ChatMessagesSection from "./_components/ChatMessagesSection";

export default function DashboardEnquiriesPage() {
  return (
    <div className="font-lato flex h-full min-h-0 min-w-0 flex-col overflow-hidden overflow-x-hidden">
      <div className="shrink-0">
        <DashboardHeading text="YOUR CHATS" />
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden overflow-x-hidden">
        <ChatMessagesSection />
      </div>
    </div>
  );
}
