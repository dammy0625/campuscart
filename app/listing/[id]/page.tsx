// app/listing/[id]/page.tsx
import ListingClient from "./ListingClient";

interface PageProps {
  params: { id: string };
}

export default function ListingPage({ params }: PageProps) {
  return <ListingClient id={params.id} />;
}
