"use client";

import {
  Activity,
  ChartNoAxesColumnIncreasing,
  ClipboardList,
  FileChartColumn,
  Map,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { DesktopNavItem } from "@/components/manager/navigation/DesktopNavItem";
import { ManagerLogoutButton } from "@/components/manager/navigation/ManagerLogoutButton";

const navigationItems = [
  {
    label: "Central Operacional",
    icon: Activity,
    href: "/central-operacional",
    section: "operations",
  },
  {
    label: "Mapa",
    icon: Map,
  },
  {
    label: "Ocorrências",
    icon: ClipboardList,
    href: "/central-operacional/ocorrencias",
    section: "occurrences",
  },
  {
    label: "Equipe",
    icon: Users,
  },
  {
    label: "Indicadores",
    icon: ChartNoAxesColumnIncreasing,
  },
  {
    label: "Relatórios",
    icon: FileChartColumn,
  },
] as const;

function isOccurrenceSection(pathname: string): boolean {
  return (
    pathname.startsWith("/central-operacional/ocorrencias") ||
    pathname.startsWith("/central-operacional/triagem") ||
    pathname.startsWith("/central-operacional/prioridade") ||
    pathname.startsWith("/central-operacional/atribuicao")
  );
}

export function DesktopNavigationRail() {
  const pathname = usePathname();

  const occurrenceSectionActive = isOccurrenceSection(pathname);

  return (
    <nav
      aria-label="Navegação do gestor"
      className="
        hidden
        w-16
        flex-col
        rounded-[16px]
        border
        border-[#E9E0D4]
        bg-white
        p-[7px]
        lg:flex
        lg:h-[calc(100dvh-132px)]
        lg:min-h-[560px]
        lg:max-h-[768px]
      "
    >
      <div
        className="
          flex
          flex-col
          gap-[10px]
        "
      >
        {navigationItems.map((item) => {
          const active =
            "section" in item && item.section === "operations"
              ? pathname === "/central-operacional"
              : "section" in item && item.section === "occurrences"
                ? occurrenceSectionActive
                : false;

          return (
            <DesktopNavItem
              key={item.label}
              label={item.label}
              icon={item.icon}
              active={active}
              href={"href" in item ? item.href : undefined}
            />
          );
        })}
      </div>

      <div
        className="
          mt-auto
          flex
          flex-col
          border-t
          border-[#E9E0D4]
          pt-[10px]
        "
      >
        <ManagerLogoutButton />
      </div>
    </nav>
  );
}
