"use client";

import { useState } from "react";

import { DesktopNavigationRail } from "@/components/manager/navigation/DesktopNavigationRail";
import { ManagerHomeShortcut } from "@/components/manager/navigation/ManagerHomeShortcut";
import { OccurrenceContextPanel } from "@/components/manager/operations/OccurrenceContextPanel";
import { OperationalMap } from "@/components/manager/operations/OperationalMap";
import { OperationsQueue } from "@/components/manager/operations/OperationsQueue";
import {
  getHumanTriagePath,
  getInitialSelectedOccurrenceId,
  getOperationalOccurrenceById,
  getOperationalOccurrences,
} from "@/controllers/manager/operations.controller";

export function OperationsDashboard() {
  const [occurrences] = useState(getOperationalOccurrences);

  const [selectedOccurrenceId, setSelectedOccurrenceId] = useState<
    string | null
  >(() => getInitialSelectedOccurrenceId(occurrences));

  const selectedOccurrence = getOperationalOccurrenceById(
    occurrences,
    selectedOccurrenceId,
  );

  const reviewHref = selectedOccurrence
    ? getHumanTriagePath(selectedOccurrence.id)
    : null;

  return (
    <main
      className="
        min-h-dvh
        overflow-x-hidden
        bg-[#FBF8F2]
        text-[#171717]
      "
    >
      <div
        className="
          mx-auto
          min-h-dvh
          w-full
          max-w-[1440px]
          px-5
          pb-5
          pt-[30px]
        "
      >
        <header
          className="
            flex
            h-14
            items-start
            gap-4
            lg:grid
            lg:grid-cols-[64px_minmax(0,1fr)]
            lg:gap-3
          "
        >
          <ManagerHomeShortcut className="ml-1" />

          <h1
            className="
              pt-2
              text-[30px]
              font-extrabold
              leading-[1.2]
              tracking-[-0.6px]
              text-[#171717]
            "
          >
            Central Operacional
          </h1>
        </header>

        <div
          className="
            mt-6
            grid
            min-w-0
            grid-cols-1
            gap-4
            lg:grid-cols-[64px_minmax(0,1fr)]
            lg:gap-3
          "
        >
          <DesktopNavigationRail />

          <div
            className="
              grid
              min-w-0
              grid-cols-1
              gap-4

              md:grid-cols-[280px_minmax(0,1fr)]

              lg:h-[calc(100dvh-132px)]
              lg:min-h-[560px]
              lg:max-h-[768px]
              lg:grid-cols-[minmax(250px,318px)_minmax(0,1fr)_minmax(250px,304px)]
            "
          >
            <OperationsQueue
              occurrences={occurrences}
              selectedOccurrenceId={selectedOccurrenceId}
              onSelectOccurrence={setSelectedOccurrenceId}
            />

            <OperationalMap
              occurrences={occurrences}
              selectedOccurrenceId={selectedOccurrenceId}
              onSelectOccurrence={setSelectedOccurrenceId}
            />

            <div
              className="
                min-w-0
                md:col-span-2
                lg:col-span-1
                lg:h-full
                lg:min-h-0
              "
            >
              <OccurrenceContextPanel
                occurrence={selectedOccurrence}
                reviewHref={reviewHref}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}