"use client";

import Image from "next/image";
import Link from "next/link";

import { handleComingSoon } from "@/controllers/citizen/home.controller";

export function CitizenHome() {
  return (
    <main className="min-h-dvh bg-[#FBF8F2] text-[#171717]">
      <div
        className="
          mx-auto
          flex
          min-h-dvh
          w-full
          max-w-[430px]
          flex-col
          px-5
          pb-7
          pt-[18px]
          max-[360px]:px-4
        "
      >
        <header className="flex items-center">
          <Image
            src="/brand/logo-horizontal.svg"
            alt="Mapeia Focos"
            width={128}
            height={30}
            priority
          />
        </header>

        <section className="mt-[22px]">
          <h1
            className="
              text-[30px]
              font-extrabold
              leading-[1.31]
              tracking-[-0.6px]
              max-[360px]:text-[27px]
            "
          >
            Ajude a transformar
            <br />
            uma observação em
            <br />
            ação no território.
          </h1>

          <p
            className="
              mt-[14px]
              max-w-[345px]
              text-[15px]
              leading-[1.45]
              text-[#746F6C]
            "
          >
            Registre possíveis focos com localização e evidências protegidas.
          </p>
        </section>

        <section className="mt-[15px] flex flex-col gap-[14px]">
          <Link
            href="/nova-ocorrencia"
            className="
              flex
              min-h-[53px]
              w-full
              items-center
              justify-center
              rounded-[14px]
              bg-[#C94F32]
              px-4
              text-center
              text-[14px]
              font-bold
              text-white
              no-underline
              transition
              duration-150
              hover:bg-[#B9472E]
              active:scale-[0.99]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#C94F32]
              focus-visible:ring-offset-2
              focus-visible:ring-offset-[#FBF8F2]
            "
          >
            Registrar possível foco
          </Link>

          <button
            type="button"
            onClick={handleComingSoon}
            className="
              flex
              min-h-[53px]
              w-full
              items-center
              justify-center
              rounded-[14px]
              border
              border-[#E9DED5]
              bg-white
              px-4
              text-[14px]
              font-bold
              text-[#171717]
              transition
              duration-150
              hover:bg-[#FDFCFA]
              active:scale-[0.99]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#C94F32]
              focus-visible:ring-offset-2
              focus-visible:ring-offset-[#FBF8F2]
            "
          >
            Acompanhar ocorrência
          </button>

          <button
            type="button"
            onClick={handleComingSoon}
            className="
              mt-px
              self-center
              border-0
              bg-transparent
              p-0
              text-[14px]
              font-semibold
              text-[#C94F32]
              underline
              decoration-[#C94F32]
              underline-offset-2
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#C94F32]
              focus-visible:ring-offset-2
              focus-visible:ring-offset-[#FBF8F2]
            "
          >
            Retomar rascunho
          </button>
        </section>

        <aside
          className="
            mt-auto
            rounded-[13px]
            border
            border-[#E5DBE1]
            bg-[#EEE8ED]
            px-[13px]
            py-[25px]
            text-[12px]
            leading-[1.4]
            text-[#4E4750]
          "
        >
          Você pode participar sem identificar seu nome. As mídias não são
          públicas.
        </aside>
      </div>
    </main>
  );
}
