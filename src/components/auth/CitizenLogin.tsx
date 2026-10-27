"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { validateCitizenCredentials } from "@/controllers/auth.controller";
import { loginSchema, type LoginFormData } from "@/schemas/auth.schema";

import { AuthField } from "./AuthField";

export function CitizenLogin() {
  const router = useRouter();
  const [authenticationError, setAuthenticationError] = useState<string | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: LoginFormData) {
    setAuthenticationError(null);

    // TODO: Replace mocked authentication with the authentication API.
    const isAuthenticated = validateCitizenCredentials(data);

    if (!isAuthenticated) {
      setAuthenticationError(
        "E-mail ou senha inválidos. Verifique os dados informados.",
      );
      return;
    }

    router.push("/");
  }

  return (
    <main className="min-h-dvh bg-[#FBF8F2] text-[#171717]">
      <div
        className="
          mx-auto
          flex
          min-h-dvh
          w-full
          flex-col
          px-8
          pb-[22px]
          pt-[26px]
          md:max-w-[760px]
          md:px-8
          md:pt-8
          max-[360px]:px-4
        "
      >
        <header className="flex items-start justify-between gap-6">
          <Image
            src="/brand/logo-horizontal.svg"
            alt="Mapeia Focos"
            width={144}
            height={23}
            className="h-auto w-[144px] max-[360px]:w-[128px]"
            priority
          />

          <Link
            href="/gestao/entrar"
            className="
              mt-[2px]
              shrink-0
              text-[11px]
              font-medium
              text-[#716B67]
              underline
              underline-offset-2
              transition
              hover:text-[#C94F32]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#C94F32]
              focus-visible:ring-offset-2
              focus-visible:ring-offset-[#FBF8F2]
            "
          >
            Logar como Gestão
          </Link>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 md:mt-10"
          noValidate
        >
          <div>
            <h1
              className="
                text-[28px]
                font-bold
                leading-9
                tracking-[-0.4px]
                md:text-[30px]
              "
            >
              Entrar
            </h1>

            <p className="mt-2 text-[12px] leading-5 text-[#716B67] md:text-[15px]">
              Entre para acompanhar ocorrências.
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-[10px] md:mt-5">
            <AuthField
              id="citizen-email"
              label="E-mail"
              type="email"
              placeholder="Digite seu e-mail"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />

            <AuthField
              id="citizen-password"
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          <div className="mt-[10px] flex justify-end">
            <button
              type="button"
              className="
                border-0
                bg-transparent
                p-0
                text-[11px]
                font-medium
                text-[#C94F32]
                underline
                underline-offset-2
                transition
                hover:text-[#9D352D]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#C94F32]
                focus-visible:ring-offset-2
                focus-visible:ring-offset-[#FBF8F2]
              "
            >
              Esqueci minha senha
            </button>
          </div>

          {authenticationError ? (
            <p
              role="alert"
              className="
                mt-3
                rounded-[8px]
                bg-[#F8E3E0]
                px-3
                py-2
                text-[11px]
                leading-4
                text-[#9D352D]
              "
            >
              {authenticationError}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col gap-[10px] md:gap-[14px]">
            <Button
              type="submit"
              loading={isSubmitting}
              className="
                w-full
                md:min-h-[53px]
                md:rounded-[14px]
              "
            >
              Entrar
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="
                w-full
                md:min-h-[53px]
                md:rounded-[14px]
              "
            >
              Criar uma conta
            </Button>
          </div>
        </form>

        <footer className="mt-auto pt-10">
          <p
            className="
              text-center
              text-[11px]
              leading-[18px]
              text-[#716B67]
              md:text-[12px]
            "
          >
            Você também pode consultar uma ocorrência sem criar conta.{" "}
            <Link
              href="/acompanhar-referencia"
              className="
                font-medium
                text-[#C94F32]
                underline
                underline-offset-2
                transition
                hover:text-[#9D352D]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#C94F32]
                focus-visible:ring-offset-2
                focus-visible:ring-offset-[#FBF8F2]
              "
            >
              Consultar Ocorrência
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}