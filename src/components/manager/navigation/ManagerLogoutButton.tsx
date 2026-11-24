"use client";

import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";

import { clearAuthSession } from "@/controllers/auth.controller";

export function ManagerLogoutButton() {
  const queryClient = useQueryClient();

  function handleLogout() {
    clearAuthSession();
    queryClient.clear();
    window.location.replace("/gestao/entrar");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      aria-label="Sair da gestão"
      title="Sair"
      className="
        flex
        h-12
        w-12
        shrink-0
        items-center
        justify-center
        rounded-[12px]
        border
        border-[#E9E0D4]
        bg-white
        text-[#584A57]
        transition-colors
        hover:border-transparent
        hover:bg-[#F8E3E0]
        hover:text-[#C94F32]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#C94F32]
        focus-visible:ring-offset-2
      "
    >
      <LogOut size={20} strokeWidth={1.8} aria-hidden="true" />
    </button>
  );
}