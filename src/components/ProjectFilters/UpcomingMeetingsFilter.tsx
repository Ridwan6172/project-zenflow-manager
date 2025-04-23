
import { Checkbox } from "@/components/ui/checkbox";

interface UpcomingMeetingsFilterProps {
  upcomingMeetings: boolean;
  setUpcomingMeetings: (checked: boolean) => void;
}

export default function UpcomingMeetingsFilter({ upcomingMeetings, setUpcomingMeetings }: UpcomingMeetingsFilterProps) {
  return (
    <div className="flex items-center mt-6">
      <Checkbox
        id="upcomingMeetings"
        checked={upcomingMeetings}
        onCheckedChange={(checked) => setUpcomingMeetings(!!checked)}
      />
      <label htmlFor="upcomingMeetings" className="ml-2 text-sm font-medium">
        Show only projects with upcoming meetings
      </label>
    </div>
  );
}
