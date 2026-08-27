import { redirect } from 'next/navigation';
import { currentWeekId } from '@/lib/weeks';

export default function StoryIndexPage() {
  redirect(`/story/${currentWeekId()}`);
}
