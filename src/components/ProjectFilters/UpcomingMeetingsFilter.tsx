
import { Checkbox } from "@/components/ui/checkbox";

interface UpcomingMeetingsFilterProps {
  upcomingMeetings: boolean;
  setUpcomingMeetings: (checked: boolean) => void;
}

export default function UpcomingMeetingsFilter({ 
  upcomingMeetings, 
  setUpcomingMeetings 
}: UpcomingMeetingsFilterProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Upcoming Meetings</label>
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="upcoming-meetings"
          checked={upcomingMeetings}
          onCheckedChange={(checked) => setUpcomingMeetings(!!checked)}
        />
        <label 
          htmlFor="upcoming-meetings" 
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show only projects with upcoming meetings
        </label>
      </div>
    </div>
  );
}
