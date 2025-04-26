
import { Checkbox } from "@/components/ui/checkbox";

interface UpcomingMeetingsFilterProps {
  upcomingMeetings: boolean;
  setUpcomingMeetings: (checked: boolean) => void;
}

export default function UpcomingMeetingsFilter({ upcomingMeetings, setUpcomingMeetings }: UpcomingMeetingsFilterProps) {
  return (
    <div className="flex items-center space-x-2">
      <label className="block text-sm font-medium mb-1">Upcoming Meetings Only</label>
      <div className="flex items-center space-x-2 mt-1">
        <Checkbox
          id="upcomingMeetings"
          checked={upcomingMeetings}
          onCheckedChange={(checked) => setUpcomingMeetings(checked as boolean)}
        />
        <label
          htmlFor="upcomingMeetings"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show only
        </label>
      </div>
    </div>
  );
}
