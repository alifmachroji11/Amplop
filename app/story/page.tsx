import { redirect } from 'next/navigation';
import { currentWeekId } from '@/lib/weeks';

// currentWeekId() depends on the real current date — this route must never be statically
// prerendered, or every visitor would get redirected to whatever week happened to be current
// at build time, forever, until the next deploy.
export const dynamic = 'force-dynamic';

export default function StoryIndexPage() {
  redirect(`/story/${currentWeekId()}`);
}
