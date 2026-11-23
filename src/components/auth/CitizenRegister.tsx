"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { registerCitizen } from "@/controllers/auth.controller";
import {
  registerCitizenSchema,
  type RegisterCitizenFormData,
} from "@/schemas/auth.schema";
import { formatCpf } from "@/utils/cpf.utils";

import { AuthField } from "./AuthField";

export function CitizenRegister() {
  const router = useRouter();
  const [registrationError, setRegistrationError] = useState<string | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterCitizenFormData>({
    resolver: zodResolver(registerCitizenSchema),
    defaultValues: {
      displayName: "",
      cpf: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterCitizenFormData) {
    setRegistrationError(null);

    const result = await registerCitizen(data);

    if (!result.success || !result.user) {
      setRegistrationError(
        result.error ??
          "Não foi possível concluir o cadastro. Verifique os dados informados.",
      );
      return;
    }

    router.push("/inicio");
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
        <header className="flex items-start">
          <Image
            src="/brand/logo-horizontal.svg"
            alt="Mapeia Focos"
            width={144}
            height={23}
            className="h-auto w-[144px] max-[360px]:w-[128px]"
            priority
          />
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
              Crie sua conta
            </h1>

            <p className="mt-2 text-[12px] leading-5 text-[#716B67] md:text-[15px]">
              Acompanhe suas ocorrências em um só lugar. O cadastro é opcional.
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-[10px] md:mt-5">
            <AuthField
              id="citizen-register-name"
              label="Nome de exibição (opcional)"
              type="text"
              placeholder="Como deseja ser chamado(a)"
              autoComplete="name"
              error={errors.displayName?.message}
              {...register("displayName")}
            />

            <AuthField
              id="citizen-register-cpf"
              label="CPF"
              type="text"
              placeholder="Digite seu CPF"
              autoComplete="off"
              maxLength={14}
              error={errors.cpf?.message}
              {...register("cpf", {
                onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                  event.target.value = formatCpf(event.target.value);
                },
              })}
            />

            <AuthField
              id="citizen-register-email"
              label="E-mail"
              type="email"
              placeholder="Digite seu e-mail"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />

            <AuthField
              id="citizen-register-password"
              label="Senha"
              type="password"
              placeholder="Crie sua senha"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register("password")}
            />

            <AuthField
              id="citizen-register-confirm-password"
              label="Confirmar senha"
              type="password"
              placeholder="Repita sua senha"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
          </div>

          <p className="mt-4 text-[11px] leading-4 text-[#716B67] md:text-[12px]">
            Cadastro público apenas para cidadãos. Contas de agentes e gestores
            são fornecidas pela gestão.
          </p>

          {registrationError ? (
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
              {registrationError}
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
              Criar conta
            </Button>

            <Button
              href="/entrar"
              variant="secondary"
              className="
                w-full
                md:min-h-[53px]
                md:rounded-[14px]
              "
            >
              Entrar em uma conta existente
            </Button>
          </div>
        </form>

        <footer className="mt-auto pt-10 text-center">
          <Link
            href="/inicio"
            className="
              text-[13px]
              font-semibold
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
            Continuar sem conta
          </Link>
        </footer>
      </div>
    </main>
  );
}

