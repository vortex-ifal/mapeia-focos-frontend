import {
  Activity,
  ChartNoAxesColumnIncreasing,
  ClipboardList,
  FileChartColumn,
  Map,
  Users,
} from "lucide-react";

import { DesktopNavItem } from "@/components/manager/navigation/DesktopNavItem";

const navigationItems = [
  {
    label: "Central Operacional",
    icon: Activity,
    href: "/central-operacional",
    active: true,
  },
  {
    label: "Mapa",
    icon: Map,
  },
  {
    label: "Ocorrências",
    icon: ClipboardList,
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

export function DesktopNavigationRail() {
  return (
    <nav
      aria-label="Navegação do gestor"
      className="
        hidden
        h-[354px]
        w-16
        flex-col
        gap-[10px]
        rounded-[16px]
        border
        border-[#E9E0D4]
        bg-white
        p-[7px]
        lg:flex
      "
    >
      {navigationItems.map((item) => (
        <DesktopNavItem
          key={item.label}
          label={item.label}
          icon={item.icon}
          active={"active" in item ? item.active : false}
          href={"href" in item ? item.href : undefined}
        />
      ))}
    </nav>
  );
}