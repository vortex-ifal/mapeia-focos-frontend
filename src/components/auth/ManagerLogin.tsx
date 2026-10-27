"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { validateManagerCredentials } from "@/controllers/auth.controller";
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

    router.push("/central-operacional");
  }

  return (
    <main
      className="
        relative
        flex
        min-h-dvh
        flex-col
        items-center
        bg-[#FBF8F2]
        px-4
        pb-8
        pt-[72px]
        text-[#171717]
        max-md:pt-10
      "
    >
      <Link
        href="/entrar"
        aria-label="Voltar para o acesso do cidadão"
        className="
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#C94F32]
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

      <section
        className="
          mt-[109px]
          w-full
          max-w-[558px]
          rounded-[16px]
          border
          border-[#E9E0D4]
          bg-white
          px-[43px]
          py-[42px]
          max-sm:px-6
          max-sm:py-8
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

          <div className="mt-6">
            <button
              type="button"
              className="
                text-[12px]
                font-medium
                text-[#C94F32]
                underline
                underline-offset-2
                transition
                hover:text-[#9D352D]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#C94F32]
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

            <Button
              type="submit"
              loading={isSubmitting}
              className="mt-5 h-[52px] w-full"
            >
              Entrar na Central
            </Button>
          </div>
        </form>
      </section>

      <p
        className="
          mt-auto
          pt-10
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