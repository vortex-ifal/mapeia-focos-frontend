# Mapeia Focos — Engineering Guidelines for Agents

Você está trabalhando no **Mapeia Focos**, uma plataforma para registro, triagem, acompanhamento e gestão territorial de ocorrências relacionadas a focos de dengue e zoonoses.

Este documento é a referência global para agentes de IA, automações e ferramentas de desenvolvimento que trabalhem em qualquer parte do projeto:

- Frontend
- Backend
- API
- Banco de dados
- Design/Figma
- Documentação
- Infraestrutura relacionada ao código
- Pull Requests e manutenção técnica

As regras globais deste documento sempre se aplicam.  
As seções específicas de Frontend ou Backend devem ser aplicadas conforme o repositório ou área modificada.

---

# 1. Regra principal

Antes de modificar qualquer arquivo:

1. Leia completamente a task e seus critérios de aceite.
2. Inspecione o código existente relacionado à tarefa.
3. Identifique dependências com outras tasks.
4. Confirme contratos reais antes de implementar integrações.
5. Quando houver design, consulte o frame exato no Figma.
6. Preserve comportamentos já funcionais.
7. Faça apenas alterações relacionadas ao escopo da tarefa.
8. Valide o resultado antes de considerá-lo concluído.
9. Não faça commits, pushes, merges ou alterações destrutivas no Git sem autorização explícita.
10. Não invente comportamento, dado, endpoint, campo ou regra de negócio.
11. Se encontrar um problema, oportunidade de melhoria ou refatoração fora do escopo atual, **não o altere automaticamente**.
12. Melhorias fora do escopo devem ser primeiro apresentadas à equipe/usuário e só podem ser executadas após aprovação explícita.

Princípio geral:

> Faça a menor alteração que resolva corretamente a tarefa, respeitando a arquitetura, o domínio e as decisões já existentes no Mapeia Focos.

---

# 2. Aprovação obrigatória para alterações fora do escopo

Esta é uma regra obrigatória para qualquer agente de IA.

Durante uma task, o agente pode encontrar:

- código duplicado;
- dívida técnica;
- bug não relacionado;
- nomenclatura ruim;
- arquivo desorganizado;
- oportunidade de refatoração;
- arquitetura inconsistente;
- componente que poderia ser reutilizado;
- dependência desatualizada;
- problema de performance;
- problema de acessibilidade;
- problema de segurança;
- inconsistência visual;
- documentação incorreta;
- oportunidade de melhorar tipos;
- estrutura de pastas melhorável;
- código legado.

Identificar esses problemas é permitido e desejável.

**Corrigi-los automaticamente não é permitido quando não fizerem parte da task atual.**

## Fluxo obrigatório

Quando encontrar algo fora do escopo:

1. Identifique o problema.
2. Avalie se ele bloqueia a task atual.
3. Se não bloquear, não altere.
4. Informe o problema ao usuário/equipe.
5. Explique brevemente:
   - o que foi encontrado;
   - por que pode ser um problema;
   - qual seria a alteração sugerida;
   - qual o impacto esperado.
6. Aguarde aprovação explícita.
7. Somente após aprovação faça a alteração.

Exemplo de comportamento correto:

> Encontrei uma duplicação entre `OccurrenceCard` e `ReviewCard`. Isso não bloqueia a T027. Minha sugestão seria extrair um componente compartilhado, mas essa refatoração alteraria arquivos fora do escopo. Posso fazer isso separadamente se você aprovar.

Exemplo incorreto:

> Aproveitei e refatorei também `ReviewOccurrence`, reorganizei os tipos e removi código duplicado.

---

## Se o problema bloquear a task

Se um problema fora do escopo impedir diretamente a conclusão da task:

1. explique o bloqueio;
2. informe a alteração mínima necessária;
3. solicite aprovação antes de expandir o escopo;
4. não faça uma refatoração ampla como solução automática.

Prefira:

> A T027 depende deste service, mas ele possui um erro de tipagem que impede o build. A correção mínima seria alterar X em Y. Posso fazer essa correção junto com a task?

Não faça:

> Refatorei toda a camada de services porque encontrei um erro.

---

## Exceção: correções estritamente necessárias dentro do próprio código alterado

Pequenos ajustes necessários para o código da task funcionar corretamente podem ser feitos sem nova aprovação quando:

- estão diretamente dentro do escopo;
- são necessários para compilar;
- são necessários para atender aos critérios de aceite;
- não alteram arquitetura;
- não expandem comportamento;
- não afetam funcionalidades independentes.

Mesmo nesses casos, mantenha a alteração mínima.

---

# 3. Idioma — regra obrigatória

O projeto possui uma separação rígida entre o idioma interno do código e o idioma apresentado ao usuário.

## Código: inglês

**Todo código deve ser escrito em inglês.**

Isso inclui:

- variáveis;
- constantes;
- funções;
- métodos;
- classes;
- interfaces;
- types;
- enums;
- componentes;
- props;
- hooks;
- states;
- services;
- controllers;
- repositories;
- entities;
- DTOs;
- schemas;
- arquivos;
- pastas relacionadas ao domínio;
- eventos internos;
- comentários técnicos;
- TODOs;
- nomes de testes, quando existirem.

Correto:

```ts
const selectedOccurrence = occurrences.find(
  (occurrence) => occurrence.id === selectedOccurrenceId,
);

function handleSelectLocation() {
  // ...
}
```

Evite:

```ts
const ocorrenciaSelecionada = ocorrencias.find(
  (ocorrencia) => ocorrencia.id === idSelecionado,
);

function selecionarLocalizacao() {
  // ...
}
```

Comentários técnicos também devem estar em inglês:

```ts
// Keeps the created occurrence to avoid a second POST when only media upload fails.
```

---

## Interface e mensagens: Português do Brasil

Todo conteúdo apresentado ao usuário deve estar em **Português do Brasil (PT-BR)**.

Isso inclui:

- títulos;
- subtítulos;
- labels;
- botões;
- placeholders;
- mensagens de validação;
- mensagens de erro;
- mensagens de sucesso;
- toasts;
- estados vazios;
- feedback de loading;
- diálogos;
- confirmações;
- textos auxiliares;
- textos de acessibilidade;
- `aria-label`;
- mensagens retornadas pela API destinadas ao usuário.

Exemplo:

```ts
function handleSubmissionError() {
  toast.error("Não foi possível enviar a ocorrência.");
}
```

O identificador está em inglês.  
A mensagem apresentada está em português.

---

## Backend e documentação da API

No backend, também devem estar em PT-BR:

- mensagens de validação dos DTOs;
- mensagens de erro HTTP destinadas ao consumidor;
- `summary`, `description` e exemplos do Swagger/OpenAPI.

Exemplo:

```ts
@ApiOperation({
  summary: "Consultar ocorrência por protocolo",
})
```

---

## Contratos externos são exceções

Não renomeie propriedades, rotas ou estruturas impostas por contratos externos apenas para seguir uma preferência interna.

Se um contrato oficial exigir determinado campo, respeite-o.

Nunca faça uma alteração incompatível silenciosamente.

---

# 4. Repositórios e stacks

O Mapeia Focos possui frontend e backend independentes.

## Frontend

Repositório:

```text
vortex-ifal/mapeia-focos-frontend
```

Stack principal:

- Node.js 24
- Next.js 16
- React 19
- TypeScript
- App Router
- Tailwind CSS 4
- TanStack Query
- React Hook Form
- Zod
- Lucide React
- React Toastify
- npm

### Gerenciador oficial

```text
npm
```

Lockfile:

```text
package-lock.json
```

Não adicione ao frontend:

```text
pnpm-lock.yaml
pnpm-workspace.yaml
yarn.lock
bun.lock
```

---

## Backend

Repositório:

```text
vortex-ifal/mapeia-focos-backend
```

Stack principal:

- Node.js 24
- TypeScript
- NestJS 12
- PostgreSQL
- Drizzle ORM
- Drizzle Kit
- class-validator
- class-transformer
- Cloudflare R2 / S3 API
- Docker
- pnpm
- Oxlint
- Prettier

### Gerenciador oficial

```text
pnpm
```

Não substitua o gerenciador de pacotes de um repositório pelo gerenciador usado no outro.

---

# 5. Domínio

Utilize nomes que representem atores e conceitos reais do Mapeia Focos.

Atores relevantes podem incluir:

```text
citizen
agent
manager
```

Não recrie estruturas herdadas de outros projetos, como:

```text
student
admin
```

quando esses conceitos não representarem atores reais do domínio.

Antes de criar um novo conceito de domínio, procure se já existe nomenclatura equivalente no projeto.

---

# 6. Frontend — arquitetura

O frontend segue uma organização **MVC pragmática adaptada ao React/Next.js**.

Não introduza outra arquitetura global sem decisão explícita da equipe.

Estrutura principal:

```text
src/
├── app/
├── components/
├── controllers/
├── hooks/
├── lib/
├── schemas/
├── services/
│   └── api/
├── types/
└── utils/
```

## `src/app`

Responsável principalmente por:

- rotas;
- páginas;
- layouts;
- composição do App Router;
- configuração global relacionada ao Next.js.

Mantenha `page.tsx` simples quando possível.

## `src/components`

Representa principalmente a View.

Organize por domínio/ator:

```text
components/
├── citizen/
└── manager/
```

Componentize quando houver responsabilidade visual clara, reutilização, lógica interativa própria ou ganho real de legibilidade.

## `src/controllers`

Responsável por:

- coordenação dos fluxos;
- estado compartilhado específico do domínio;
- persistência temporária;
- orquestração entre interface e services.

Fluxo preferencial:

```text
View
  ↓
Controller
  ↓
Service
  ↓
API
```

Não duplique mecanismos já existentes no controller.

## `src/services/api`

Responsável pela comunicação HTTP.

Regras:

- centralizar chamadas de API;
- utilizar a configuração existente para URLs;
- verificar `response.ok`;
- tratar respostas inválidas;
- propagar falhas de maneira previsível;
- não espalhar chamadas HTTP por componentes.

## `src/types`

Tipos diferentes devem representar conceitos diferentes.

Exemplo:

```text
OccurrenceFormData
OccurrenceResponse
OperationalOccurrence
```

## `src/schemas`

Utilize Zod para validações do frontend quando aplicável.

Identificadores em inglês e mensagens de usuário em PT-BR.

## `src/utils`

Utilitários compartilhados.

Não esconda regras importantes de negócio em `utils`.

## `src/lib`

Infraestrutura compartilhada, como providers, QueryClient e configurações globais.

---

# 7. Frontend — estado

Evite múltiplas fontes de verdade.

Se fila, mapa e painel representam a mesma ocorrência selecionada:

```ts
const [selectedOccurrenceId, setSelectedOccurrenceId] =
  useState<string>();
```

Todas as representações devem derivar desse estado.

## Rascunho de ocorrência

Utilize as abstrações existentes:

```ts
saveOccurrenceDraft();
getOccurrenceDraft();
getOccurrenceDraftSnapshot();
subscribeToOccurrenceDraft();
clearOccurrenceDraft();
```

Não duplique o mecanismo de persistência.

## Arquivos e mídias

Objetos `File` não devem ser serializados em `localStorage` ou `sessionStorage`.

Considere:

- navegação;
- retorno;
- reload;
- falha parcial;
- retry.

Nunca crie uma segunda ocorrência apenas porque o upload de mídia da primeira falhou.

---

# 8. Figma é a fonte de verdade visual

Arquivo oficial:

```text
https://www.figma.com/design/WjMoH9ToCExJLjpuDisGf6/Mapeia-Focos
```

Quando uma task mencionar uma tela existente no protótipo:

**inspecione obrigatoriamente o frame correspondente antes de implementar a UI.**

Não desenvolva apenas a partir de:

- descrição textual;
- screenshot;
- memória;
- tela semelhante;
- interpretação própria.

A task define principalmente comportamento e critérios de aceite.

O Figma define principalmente estrutura e aparência visual.

## Fidelidade

Preserve:

- hierarquia;
- espaçamento;
- cores;
- raios;
- bordas;
- tipografia;
- posicionamento;
- textos;
- estados;
- ícones;
- feedbacks.

Não redesenhe a interface sem solicitação.

## Dimensões

Dimensões do frame são referências visuais e não necessariamente dimensões fixas do navegador.

Um frame de 390 px não deve resultar automaticamente em uma aplicação com largura fixa de 390 px.

Layouts devem permanecer responsivos.

---

# 9. Design System

Antes de criar novos valores visuais, procure os existentes no projeto/Figma.

Evite criar cores, espaçamentos, raios ou componentes quase idênticos aos existentes.

A tipografia oficial e demais tokens devem ser respeitados quando fizerem parte do escopo da implementação.

Não realize mudanças globais de Design System como consequência indireta de outra task.

---

# 10. Backend — arquitetura

O backend segue **Clean Architecture + MVC pragmático**, com responsabilidades bem definidas.

Estrutura principal:

```text
src/
├── controllers/
├── dtos/
├── entities/
├── infra/
├── mappers/
├── modules/
├── repositories/
└── services/
```

## Controllers

Responsáveis por:

- rotas HTTP;
- recepção de DTOs;
- Guards;
- Pipes;
- conversão para domínio;
- respostas HTTP.

Não devem conter regras complexas de negócio ou SQL.

## Services

Responsáveis pelos casos de uso e regras de negócio.

Evite fazer services dependerem diretamente de DTOs HTTP.

## Entities

São o núcleo do modelo de domínio.

Preserve os padrões existentes:

```text
*.entity.ts
*.props.ts
*.builder.ts
```

## Read Models

Use Read Models quando uma consulta não precisar carregar uma entidade inteira.

Isso reduz acoplamento, custo de consulta e risco de vazamento de dados.

## Mappers

Conversões entre camadas devem passar por Mappers quando esse padrão estiver estabelecido.

Exemplos:

```text
toDomainFromDto()
toDto()
toPersistence()
toDomainFromPersistence()
```

## Repositories

Isolam acesso a banco e queries Drizzle.

Controllers não consultam banco diretamente.

## Modules

Agrupam adequadamente Controllers, Services, Repositories e dependências.

---

# 11. Barrel exports no backend

Preserve o padrão de `index.ts` adotado no backend.

Prefira importar de barrel exports existentes em vez de acessar diretamente arquivos internos de outras camadas.

---

# 12. API — contrato compartilhado

Frontend e backend devem concordar sobre o contrato HTTP.

Nunca invente:

- endpoint;
- campo;
- enum;
- status;
- paginação;
- payload;
- resposta.

Antes de integrar:

1. confira controller;
2. confira DTO;
3. confira mapper;
4. confira service;
5. confira dependências da task.

O padrão de JSON é `camelCase`.

O banco pode utilizar `snake_case`.

Essas representações não devem ser confundidas.

---

# 13. Dependências entre tasks

Se uma task depende de outra ainda não implementada:

**não finja que a dependência existe.**

Se necessário utilizar dados temporários:

- isole fixtures;
- marque-os claramente;
- facilite sua remoção futura;
- não apresente mock como integração real.

Exemplo:

```ts
// TODO(T030): replace fixture with the occurrence listing API.
```

---

# 14. Banco de dados

Consulte o DER e os schemas existentes antes de alterar a estrutura de dados.

## Migrations

Use nomes explícitos:

```bash
pnpm db:generate --name add_status_to_occurrences
```

Migrations devem ser focadas e revisadas antes de aplicação.

## Seeds

Seeds devem ser idempotentes.

Não utilize `TRUNCATE` como comportamento normal de seed.

---

# 15. Variáveis de ambiente

Nunca versione segredos.

## Frontend

Use `.env.local`.

A variável pública de API atualmente utilizada é:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Variáveis `NEXT_PUBLIC_*` são expostas ao navegador.

## Backend

Use `.env.example` como documentação das variáveis necessárias.

Sempre que adicionar uma variável:

- documente-a;
- não inclua credencial real;
- atualize documentação quando necessário.

---

# 16. Segurança e privacidade

O Mapeia Focos pode manipular:

- localização;
- coordenadas;
- endereço;
- evidências;
- dados de contato;
- usuários.

Nunca:

- registre dados pessoais desnecessariamente;
- envie secrets ao frontend;
- exponha stack traces ao usuário;
- retorne dados além do necessário;
- coloque credenciais em código.

---

# 17. Validação de entrada

## Frontend

Utilize React Hook Form + Zod quando adequado.

## Backend

Utilize `class-validator` e `class-transformer`.

Validação do frontend não substitui validação do backend.

---

# 18. Tratamento de erros

Nunca apresente sucesso antes de confirmação real.

Considere corretamente:

- loading;
- error;
- empty state;
- retry;
- partial failure.

Não esconda falhas da API atrás de estados falsos de sucesso.

---

# 19. Acessibilidade

No frontend, considere:

- HTML semântico;
- teclado;
- foco visível;
- contraste;
- labels;
- `aria-label`;
- texto alternativo;
- estados disabled;
- tamanhos adequados de interação.

Use elementos semanticamente corretos.

---

# 20. TypeScript

Mantenha tipagem rigorosa.

Evite:

```text
any
as unknown as X
```

como forma de esconder incompatibilidades.

Resolva o contrato corretamente.

---

# 21. Dependências

Antes de adicionar uma biblioteca:

1. verifique se a solução já existe;
2. confirme necessidade;
3. avalie impacto;
4. utilize o gerenciador correto do repositório.

Não adicione bibliotecas apenas por conveniência.

---

# 22. Refatorações

Refatorações devem ser tratadas como mudanças de escopo.

Uma IA **não possui autorização implícita para refatorar código apenas porque encontrou uma oportunidade**.

Refatoração permitida sem nova aprovação:

- pequena;
- estritamente localizada;
- necessária para implementar a task;
- sem alterar APIs públicas;
- sem afetar outros fluxos;
- sem expandir significativamente o diff.

Qualquer refatoração maior deve ser sugerida primeiro.

## Exemplos que exigem aprovação

- mover arquivos;
- renomear vários componentes;
- alterar arquitetura;
- introduzir abstração compartilhada;
- mudar padrão de estado;
- dividir ou unir services;
- alterar contratos;
- substituir biblioteca;
- reescrever componente não relacionado;
- reorganizar Design System;
- modificar outras telas;
- limpar código legado fora do escopo.

---

# 23. Problemas encontrados fora da task

Ao encontrar algo relevante fora da task, registre como:

```text
Finding:
<problema>

Impact:
<impacto>

Suggested change:
<alteração sugerida>

Scope:
Fora da task atual. Nenhuma alteração realizada.
```

A IA deve aguardar aprovação antes de executar a sugestão.

Se houver vários problemas, priorize os relevantes. Não transforme a entrega da task em uma auditoria extensa sem solicitação.

---

# 24. Testes

Não introduza infraestrutura de testes automaticamente.

Se uma task exigir testes, siga o padrão existente ou a instrução da task.

Validação manual dos critérios de aceite continua obrigatória.

---

# 25. Frontend — validação obrigatória

Antes de concluir uma alteração:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Quando houver mudança de dependências:

```bash
npm audit --omit=dev
```

Não utilize automaticamente:

```bash
npm audit fix --force
```

---

# 26. Backend — validação obrigatória

Antes de concluir uma alteração:

```bash
pnpm lint
pnpm build
```

Quando houver alteração de banco, valide também o fluxo correspondente de migration/schema.

---

# 27. Validação funcional

Build verde não substitui teste funcional.

Teste de acordo com os critérios de aceite:

- caminho principal;
- loading;
- erro;
- retry;
- retorno;
- estado vazio;
- persistência;
- regressões relacionadas.

---

# 28. Documentação

Atualize documentação quando a task mudar:

- arquitetura;
- setup;
- variáveis;
- contrato;
- schema;
- diretórios;
- comportamento relevante.

Não atualize documentação não relacionada apenas por preferência.

---

# 29. Git — antes de trabalhar

Sempre confira:

```bash
git status
git branch --show-current
```

Não descarte alterações existentes do desenvolvedor.

Frontend normalmente utiliza:

```text
main
```

Backend atualmente utiliza:

```text
develop
```

Confirme a branch base antes de trabalhar.

---

# 30. Branches

Uma branch deve representar prioritariamente uma task.

Exemplos:

```text
feat/T027-operational-dashboard
fix/T017-location-flow
chore/T031-legacy-cleanup
```

Evite misturar tasks independentes.

---

# 31. Commits

**Nunca faça commit sem solicitação explícita.**

Também não faça automaticamente:

```text
push
merge
rebase
cherry-pick
```

Não altere:

```text
git config user.name
git config user.email
```

sem solicitação.

---

# 32. Operações Git destrutivas

Não execute sem autorização:

```bash
git reset --hard
git clean -fd
git push --force
git rebase
```

Nunca apague trabalho local para "limpar" o projeto.

---

# 33. Pull Requests

Uma PR deve conter somente alterações relacionadas à task.

A descrição deve informar:

- task;
- objetivo;
- principais alterações;
- decisões;
- dependências;
- validações;
- limitações conhecidas.

Não declare uma validação que não foi executada.

---

# 34. Scope control — regra mandatória

O escopo definido pela task é um limite.

Uma IA não pode expandi-lo unilateralmente.

Antes de alterar um arquivo, pergunte:

> Esta alteração é necessária para cumprir a task ou seus critérios de aceite?

Se a resposta for não:

**não altere sem aprovação.**

### Permitido

```text
Task exige modificar A.
A depende diretamente de B.
B precisa de uma pequena correção para A funcionar.
```

Ainda assim, mantenha a correção mínima.

### Não permitido

```text
Task exige modificar A.
Ao abrir B, percebi que poderia melhorar B, C e D.
Refatorei todos eles.
```

Nesse caso, apenas sugira.

---

# 35. Código gerado por IA

Antes de considerar código pronto:

- remova imports não utilizados;
- remova código morto criado pela própria alteração;
- remova `console.log`;
- remova placeholders acidentais;
- remova mocks acidentais;
- confirme tipos;
- confira contratos;
- confira textos;
- confirme idioma.

Não faça uma limpeza geral de arquivos antigos apenas porque está revisando o código.

Essa limpeza também está sujeita à regra de aprovação de escopo.

---

# 36. Workflow obrigatório para tasks

## 1. Entender

Leia:

- descrição;
- critérios de aceite;
- dependências.

## 2. Inspecionar

Confira:

- branch;
- arquivos;
- arquitetura;
- implementações existentes.

## 3. Delimitar escopo

Determine:

- arquivos que provavelmente precisam mudar;
- comportamento esperado;
- dependências diretas.

Não expanda silenciosamente esse conjunto durante a execução.

## 4. Design

Se houver UI:

- consulte o Figma;
- inspecione o frame exato.

## 5. Backend/API

Se houver integração:

- confira contrato real;
- não invente dependências.

## 6. Implementar

Faça apenas o necessário.

## 7. Descobertas adicionais

Se encontrar algo fora do escopo:

- registre;
- sugira;
- não implemente sem aprovação.

## 8. Idioma

Confirme:

```text
Code = English
User-facing content = PT-BR
```

## 9. Validar

Execute os comandos adequados.

## 10. Testar

Valide os critérios de aceite.

## 11. Revisar diff

```bash
git status
git diff
```

Pergunte novamente:

> Cada alteração deste diff pertence à task ou foi explicitamente aprovada?

Se não, remova a alteração não autorizada antes da entrega.

---

# 37. Definition of Done

Uma task só está pronta quando:

- [ ] critérios de aceite atendidos;
- [ ] dependências verificadas;
- [ ] Figma consultado quando aplicável;
- [ ] arquitetura respeitada;
- [ ] contratos reais foram usados;
- [ ] código está em inglês;
- [ ] mensagens de usuário estão em PT-BR;
- [ ] dados sensíveis estão protegidos;
- [ ] estados relevantes foram considerados;
- [ ] não há imports não utilizados;
- [ ] não há código morto introduzido pela task;
- [ ] não há `console.log` esquecido;
- [ ] validações técnicas passaram;
- [ ] fluxo funcional foi testado;
- [ ] documentação necessária foi atualizada;
- [ ] diff contém somente alterações da task ou alterações explicitamente aprovadas;
- [ ] melhorias extras encontradas foram sugeridas, não executadas sem aprovação;
- [ ] nenhum commit foi criado sem autorização;
- [ ] nenhuma operação destrutiva de Git foi executada.

---

# 38. Regras de decisão

Quando houver dúvida entre criar algo novo e reutilizar:

> Investigue primeiro o que já existe.

Quando houver dúvida visual:

> Consulte o Figma.

Quando houver dúvida sobre API:

> Consulte o backend e o contrato real.

Quando houver dúvida sobre banco:

> Consulte schema, migrations e DER.

Quando houver dúvida sobre idioma:

> Código, identificadores e comentários técnicos em inglês.  
> Conteúdo apresentado ao usuário em Português do Brasil.

Quando encontrar uma possível melhoria que não pertence à task:

> Sugira primeiro. Não implemente sem aprovação explícita.

Quando encontrar um bug não relacionado:

> Informe primeiro. Não corrija silenciosamente.

Quando desejar fazer uma refatoração:

> Verifique se ela é necessária para a task. Se não for, peça aprovação.

Quando houver dúvida sobre escopo:

> Faça a menor alteração correta necessária para cumprir a task.

Quando uma dependência não existir:

> Não invente sua implementação como se ela já estivesse disponível.

Quando o código parecer funcionar mas ainda não tiver sido validado:

> Não considere a tarefa concluída.

---

# 39. Regra de ouro para agentes

A autonomia da IA termina onde começa uma mudança de escopo.

A IA é incentivada a:

- identificar problemas;
- pensar criticamente;
- sugerir melhorias;
- antecipar riscos;
- apontar dívida técnica;
- propor refatorações;
- recomendar melhorias arquiteturais.

Mas:

> **Identificar não significa ter autorização para modificar.**

Para qualquer mudança fora da task:

```text
IDENTIFICAR
    ↓
EXPLICAR
    ↓
SUGERIR
    ↓
AGUARDAR APROVAÇÃO
    ↓
IMPLEMENTAR
```

Nunca:

```text
IDENTIFICAR
    ↓
IMPLEMENTAR AUTOMATICAMENTE
```

---

# 40. Objetivo final

O objetivo de qualquer contribuição ao Mapeia Focos não é produzir o maior volume possível de código nem deixar tudo que o agente encontrou "mais bonito".

O objetivo é produzir software:

- confiável;
- consistente;
- seguro;
- revisável;
- acessível;
- fiel ao produto;
- fiel ao Design System;
- alinhado entre frontend e backend;
- simples de manter;
- limitado ao escopo aprovado;
- previsível para toda a equipe.