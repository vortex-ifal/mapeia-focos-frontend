"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import {
  MOCK_MANAGER_CREDENTIALS,
  MOCK_USERS,
  saveAuthSession,
  validateManagerCredentials,
} from "@/controllers/auth.controller";
import { loginSchema, type LoginFormData } from "@/schemas/auth.schema";

import { AuthField } from "./AuthField";

export function ManagerLogin() {
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
    const isAuthenticated = validateManagerCredentials(data);

    if (!isAuthenticated) {
      setAuthenticationError(
        "Credenciais inválidas. Verifique o e-mail e a senha informados.",
      );

      return;
    }

    saveAuthSession(MOCK_USERS[MOCK_MANAGER_CREDENTIALS.email]);

    router.push("/central-operacional");
  }

  return (
    <main
      className="
        grid
        min-h-dvh
        grid-rows-[auto_1fr_auto]
        bg-[#FBF8F2]
        px-4
        py-7
        text-[#171717]
        max-sm:py-5
      "
    >
      <div className="flex justify-center">
        <Link
          href="/entrar"
          aria-label="Ir para o acesso do cidadão"
          className="
            rounded-sm
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#C94F32]
            focus-visible:ring-offset-2
          "
        >
          <Image
            src="/brand/logo-horizontal.svg"
            alt="Mapeia Focos"
            width={144}
            height={23}
            priority
          />
        </Link>
      </div>

      <div
        className="
          flex
          min-h-0
          items-center
          justify-center
          py-5
          max-sm:py-4
        "
      >
        <section
          className="
            w-full
            max-w-[558px]
            rounded-[16px]
            border
            border-[#E9E0D4]
            bg-white
            px-[43px]
            py-[36px]
            max-sm:px-6
            max-sm:py-7
          "
        >
          <div>
            <h1
              className="
                text-[32px]
                font-bold
                leading-[1.2]
                tracking-[-0.02em]
              "
            >
              Entrar na gestão
            </h1>

            <p
              className="
                mt-2
                max-w-[472px]
                text-[12px]
                leading-[1.65]
                text-[#716B67]
              "
            >
              Use as credenciais disponibilizadas pela equipe responsável para
              acessar a Central Operacional.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6" noValidate>
            <div className="flex flex-col gap-[14px]">
              <AuthField
                id="manager-email"
                label="E-mail institucional"
                type="email"
                placeholder="Digite seu e-mail"
                autoComplete="email"
                error={errors.email?.message}
                {...register("email")}
              />

              <AuthField
                id="manager-password"
                label="Senha"
                type="password"
                placeholder="Digite sua senha"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register("password")}
              />
            </div>

            <div className="mt-5">
              <button
                type="button"
                className="
                  text-[12px]
                  font-medium
                  text-[#C94F32]
                  underline
                  underline-offset-2
                  transition-colors
                  hover:text-[#9D352D]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#C94F32]
                  focus-visible:ring-offset-2
                "
              >
                Esqueci minha senha
              </button>

              {authenticationError ? (
                <p
                  role="alert"
                  className="
                    mt-3
                    rounded-[8px]
                    bg-[#F8E3E0]
                    px-3
                    py-2
                    text-[12px]
                    leading-5
                    text-[#9D352D]
                  "
                >
                  {authenticationError}
                </p>
              ) : null}

              <div
                className="
                  mt-5
                  flex
                  flex-col
                  gap-[10px]
                "
              >
                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="h-[52px] w-full"
                >
                  Entrar na Central
                </Button>

                <Link
                  href="/entrar"
                  className="
                    flex
                    h-[52px]
                    w-full
                    items-center
                    justify-center
                    rounded-[12px]
                    border
                    border-[#E9E0D4]
                    bg-white
                    text-[13px]
                    font-bold
                    text-[#171717]
                    transition-colors
                    hover:bg-[#F4EFE6]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#C94F32]
                    focus-visible:ring-offset-2
                  "
                >
                  Entrar como cidadão
                </Link>
              </div>
            </div>
          </form>
        </section>
      </div>

      <p
        className="
          text-center
          text-[11px]
          leading-[19px]
          text-[#716B67]
        "
      >
        Acesso exclusivo à equipe de gestão do Mapeia Focos.
      </p>
    </main>
  );
}