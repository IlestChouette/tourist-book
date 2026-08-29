import { Suspense } from "react";
import EntrerForm from "./EntrerForm";

export default function EntrerPage({ params }) {
  return (
    <Suspense>
      <EntrerForm params={params} />
    </Suspense>
  );
}
