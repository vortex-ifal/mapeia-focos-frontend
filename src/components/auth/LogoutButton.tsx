"use client";

import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

import {
  clearAuthSession,
  getAuthSessionSnapshot,
  getAuthSession,
  LOGIN_ROUTE,
  subscribeToAuthSession,
} from "@/controllers/auth.controller";

type LogoutButtonProps = {
  hasUnsavedDraft?: boolean;
};

export function LogoutButton({ hasUnsavedDraft = false }: LogoutButtonProps) {
  const queryClient = useQueryClient();

  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const sessionSnapshot = useSyncExternalStore(
    subscribeToAuthSession,
    getAuthSessionSnapshot,
    () => null,
  );

  const isAuthenticated = sessionSnapshot !== null;

  function finishLogout() {
    const destination = getAuthSession()?.role === "manager"
      ? "/gestao/entrar"
      : LOGIN_ROUTE;
    clearAuthSession();
    queryClient.clear();
    setConfirmationOpen(false);
    window.location.replace(destination);
  }

  function handleLogout() {
    if (hasUnsavedDraft) {
      setConfirmationOpen(true);

      return;
    }

    finishLogout();
  }

  useEffect(() => {
    if (!confirmationOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setConfirmationOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [confirmationOpen]);

  /*
   * The citizen home is accessible anonymously.
   * Do not display logout when there is no active session.
   */
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={handleLogout}
        aria-label="Sair da conta"
        title="Sair da conta"
        className="
          inline-flex
          min-h-9
          shrink-0
          items-center
          justify-center
          gap-1.5
          rounded-[10px]
          border
          border-[#E9E0D4]
          bg-white
          px-3
          text-[12px]
          font-semibold
          text-[#584A57]
          transition
          hover:border-[#D8CEC4]
          hover:bg-[#F4EFE6]
          hover:text-[#C94F32]
          active:scale-[0.98]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#C94F32]
          focus-visible:ring-offset-2
          focus-visible:ring-offset-[#FBF8F2]
        "
      >
        <LogOut size={15} strokeWidth={1.8} aria-hidden="true" />

        <span>Sair</span>
      </button>

      {confirmationOpen ? (
        <LogoutConfirmationModal
          onCancel={() => setConfirmationOpen(false)}
          onConfirm={finishLogout}
        />
      ) : null}
    </>
  );
}

type LogoutConfirmationModalProps = {
  onCancel: () => void;
  onConfirm: () => void;
};

function LogoutConfirmationModal({
  onCancel,
  onConfirm,
}: LogoutConfirmationModalProps) {
  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/35
        px-5
      "
      role="presentation"
      onMouseDown={onCancel}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-confirmation-title"
        aria-describedby="logout-confirmation-description"
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
        className="
          w-full
          max-w-[360px]
          rounded-[18px]
          border
          border-[#E9E0D4]
          bg-white
          p-5
          shadow-xl
        "
      >
        <h2
          id="logout-confirmation-title"
          className="
            text-[19px]
            font-bold
            leading-[1.3]
            text-[#171717]
          "
        >
          Sair mesmo assim?
        </h2>

        <p
          id="logout-confirmation-description"
          className="
            mt-2
            text-[13px]
            leading-[1.5]
            text-[#716B67]
          "
        >
          Você possui uma vistoria salva neste dispositivo que ainda pode não
          ter sido sincronizada. O rascunho será mantido, mas você precisará
          entrar novamente para continuar o trabalho.
        </p>

        <div
          className="
            mt-5
            flex
            flex-col-reverse
            gap-2
            sm:flex-row
            sm:justify-end
          "
        >
          <button
            type="button"
            onClick={onCancel}
            className="
              flex
              h-11
              items-center
              justify-center
              rounded-[12px]
              border
              border-[#E9E0D4]
              bg-white
              px-4
              text-[13px]
              font-bold
              text-[#171717]
              transition
              hover:bg-[#F4EFE6]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#C94F32]
              focus-visible:ring-offset-2
            "
          >
            Continuar conectado
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="
              flex
              h-11
              items-center
              justify-center
              rounded-[12px]
              bg-[#C94F32]
              px-4
              text-[13px]
              font-bold
              text-white
              transition
              hover:bg-[#B9472E]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#C94F32]
              focus-visible:ring-offset-2
            "
          >
            Sair da conta
          </button>
        </div>
      </section>
    </div>
  );
}