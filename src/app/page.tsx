import { redirect } from "next/navigation";

/**
 * On each subdomain the events module is reached at /events (the route embedded
 * into the landing page). Root simply forwards there; the track is resolved
 * from the host by middleware.
 */
export default function Home() {
  redirect("/events");
}
