# Mapeia Focos

Frontend do **Mapeia Focos**, plataforma para registro, acompanhamento e gestão de ocorrências relacionadas a focos identificados no território.

O projeto utiliza Next.js, React e TypeScript e organiza suas responsabilidades entre rotas, componentes, controllers, serviços, schemas, tipos e utilitários.

## Requisitos

- Node.js 24, conforme `.nvmrc` e `package.json`
- npm

## Instalação

Instale as dependências utilizando o gerenciador oficial do frontend:

```bash
npm ci
```

## Variáveis de ambiente

O projeto utiliza variáveis de ambiente para configurar a comunicação com o backend.

Um arquivo `.env.example` está disponível na raiz do projeto com as variáveis necessárias.

Crie um arquivo `.env.local` a partir dele:

```bash
cp .env.example .env.local
```

A variável necessária para comunicação com a API é:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### `NEXT_PUBLIC_API_URL`

Define a URL base do backend do Mapeia Focos.

Em desenvolvimento local, considerando o backend executando na porta `8000`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

A aplicação adiciona internamente o prefixo `/api` aos endpoints quando necessário.

Variáveis com prefixo `NEXT_PUBLIC_` ficam disponíveis no navegador e, portanto, **não devem conter senhas, tokens privados ou outros segredos**.

Arquivos locais `.env*` não devem ser versionados. O `.env.example` permanece versionado apenas como referência de configuração.

## Executando o projeto

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Por padrão, a aplicação estará disponível em:

```text
http://localhost:3000
```

## Comandos

```bash
npm run dev
npm run lint
npm run build
npm start
```

Para verificar a tipagem sem gerar arquivos:

```bash
npx tsc --noEmit
```

## Validação

Antes de enviar alterações para revisão:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## Estrutura do projeto

```text
src/
├── app/
├── components/
│   └── citizen/
├── controllers/
│   └── citizen/
├── hooks/
├── lib/
├── schemas/
├── services/
│   └── api/
├── types/
└── utils/

public/
└── brand/
```

### Responsabilidades

- `src/app`: rotas e configuração do App Router.
- `src/components`: componentes de interface organizados por domínio.
- `src/controllers`: coordenação dos fluxos e estados da aplicação.
- `src/services/api`: comunicação com o backend e serviços externos.
- `src/schemas`: schemas de validação.
- `src/types`: tipos TypeScript compartilhados.
- `src/utils`: funções utilitárias.
- `src/lib`: infraestrutura e configurações compartilhadas.
- `src/hooks`: hooks React compartilhados quando necessários.
- `public/brand`: arquivos da identidade visual.

## Fluxo de ocorrência

O fluxo principal de registro atualmente é:

```text
/
↓
/nova-ocorrencia
↓
/nova-ocorrencia/localizacao
↓
/nova-ocorrencia
↓
/nova-ocorrencia/revisar
↓
envio para a API
```

O rascunho da ocorrência é preservado durante a navegação para manter as informações preenchidas pelo cidadão.

As mídias selecionadas são mantidas temporariamente em memória durante o fluxo.

## Diretrizes para agentes

O projeto possui um arquivo:

```text
AGENTS.md
```

na raiz do repositório.

Ele define as regras de arquitetura, idioma, integração, design, Git e controle de escopo que devem ser seguidas por agentes de IA e automações que trabalhem no Mapeia Focos.