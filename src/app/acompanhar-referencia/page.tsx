import { Suspense } from "react";
import { TrackReference } from "@/components/citizen/occurrence/TrackReference";

export default function TrackReferencePage() {
  return (
    <Suspense fallback={null}>
      <TrackReference />
    </Suspense>
  );
}
