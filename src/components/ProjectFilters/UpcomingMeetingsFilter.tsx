
import { Checkbox } from "@/components/ui/checkbox";

interface UpcomingMeetingsFilterProps {
  upcomingMeetings: boolean;
  setUpcomingMeetings: (checked: boolean) => void;
}

export default function UpcomingMeetingsFilter({ upcomingMeetings, setUpcomingMeetings }: UpcomingMeetingsFilterProps) {
  return (
    <div className="flex items-center mt-6">

      <label htmlFor="upcomingMeetings" className="ml-2 text-sm font-medium">
       
      </label>
    </div>
  );
}
