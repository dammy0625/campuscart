import ListingClient from "./ListingClient";

export default async function ListingPage(props: { params: { id: string } }) {
  const { id } = await props.params;
  return <ListingClient id={id} />;
}
