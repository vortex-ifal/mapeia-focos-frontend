# Diretrizes e Padrões do Frontend — Mapeia Focos

Você está trabalhando no frontend do sistema **Mapeia Focos**.

Siga rigorosamente as regras abaixo ao ler, criar, modificar, refatorar ou revisar código neste repositório.

---

## 1. Stack e ferramentas

- **Framework:** Next.js 16 com App Router.
- **UI:** React 19.
- **Linguagem:** TypeScript.
- **Estilização:** Tailwind CSS 4.
- **Formulários:** React Hook Form.
- **Validação:** Zod.
- **Data fetching/cache:** TanStack Query.
- **Feedback:** React Toastify.
- **Ícones:** Lucide React.
- **Runtime:** Node.js 24.
- **Gerenciador de pacotes:** npm.

Antes de adicionar uma nova biblioteca, verifique se a funcionalidade já pode ser implementada com as dependências existentes.

---

## 2. Gerenciador de pacotes

Este repositório utiliza exclusivamente:

```bash
npm
```

O lockfile oficial é:

```text
package-lock.json
```

Não crie ou utilize:

```text
pnpm-lock.yaml
pnpm-workspace.yaml
yarn.lock
bun.lock
```

Para instalar uma dependência:

```bash
npm install <package>
```

Para remover:

```bash
npm uninstall <package>
```

Nunca execute automaticamente:

```bash
npm audit fix --force
```

---

## 3. Idioma

### Código em inglês

Todo código deve ser escrito em inglês.

Isso inclui:

- variáveis;
- funções;
- métodos;
- componentes;
- types;
- interfaces;
- enums;
- props;
- hooks;
- states;
- services;
- controllers;
- schemas;
- arquivos;
- pastas de domínio;
- comentários técnicos;
- TODOs;
- eventos internos.

Correto:

```ts
const selectedOccurrence = occurrences.find(
  (occurrence) => occurrence.id === selectedOccurrenceId,
);
```

Errado:

```ts
const ocorrenciaSelecionada = ocorrencias.find(
  (ocorrencia) => ocorrencia.id === idOcorrenciaSelecionada,
);
```

Comentários técnicos também devem estar em inglês.

---

### Interface em Português do Brasil

Todo texto apresentado ao usuário deve estar em **PT-BR**.

Isso inclui:

- títulos;
- labels;
- botões;
- placeholders;
- validações;
- mensagens de erro;
- mensagens de sucesso;
- toasts;
- estados vazios;
- feedbacks;
- `aria-label`;
- textos auxiliares.

Exemplo:

```ts
toast.error("Não foi possível enviar a ocorrência.");
```

Identificador interno em inglês, mensagem ao usuário em português.

---

## 4. Arquitetura

O frontend utiliza uma organização **MVC pragmática adaptada ao React e Next.js**.

Não introduza Hexagonal Architecture, Clean Architecture completa ou outra arquitetura paralela sem decisão explícita da equipe.

Estrutura principal:

```text
src/
├── app/
├── components/
├── controllers/
├── lib/
├── schemas/
├── services/
│   └── api/
├── types/
└── utils/
```

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

---

## 5. `src/app`

Responsável por:

- rotas;
- páginas;
- layouts;
- configuração do App Router;
- composição inicial das telas.

Mantenha `page.tsx` pequeno sempre que possível.

Preferível:

```tsx
import { OperationsDashboard } from "@/components/manager/operations/OperationsDashboard";

export default function Page() {
  return <OperationsDashboard />;
}
```

Evite implementar toda a lógica e interface diretamente em `page.tsx`.

---

## 6. `src/components`

Representa principalmente a camada de **View**.

Organize os componentes por domínio ou ator.

Exemplo:

```text
components/
├── citizen/
└── manager/
```

Papéis válidos devem representar o domínio real do Mapeia Focos.

Não recrie estruturas legadas como:

```text
admin
student
```

sem existir um requisito de domínio correspondente.

---

## 7. Componentização

Crie um componente separado quando houver:

- responsabilidade visual clara;
- reutilização;
- lógica interativa própria;
- complexidade relevante;
- benefício real de legibilidade.

Não transforme cada elemento visual em um componente.

Também não concentre telas complexas inteiras em um único arquivo sem necessidade.

---

## 8. `src/controllers`

Controllers são responsáveis por:

- coordenação de fluxos;
- estado compartilhado de um domínio;
- preparação de dados para a View;
- persistência temporária;
- orquestração entre componentes e services.

Não faça chamadas HTTP complexas diretamente nos componentes quando o fluxo possuir controller/service apropriado.

Não duplique mecanismos de estado já existentes.

---

## 9. `src/services/api`

Responsável pela comunicação com o backend.

Regras:

- centralize chamadas HTTP;
- utilize `buildApiUrl()`;
- valide `response.ok`;
- trate respostas inválidas;
- propague erros de forma previsível;
- não hardcode URLs de backend em componentes.

Correto:

```ts
const endpoint = buildApiUrl("occurrences");
```

Evite:

```ts
fetch("http://localhost:8000/api/occurrences");
```

---

## 10. Contratos de API

Nunca invente:

- endpoint;
- payload;
- resposta;
- enum;
- status;
- paginação;
- campo.

Antes de implementar uma integração:

1. confira o backend;
2. confira o controller;
3. confira os DTOs;
4. confirme se a dependência da task já existe;
5. utilize o contrato real.

O padrão esperado para propriedades JSON da API é:

```text
camelCase
```

Não confunda nomes de banco em `snake_case` com o contrato HTTP.

---

## 11. Dependências entre tasks

Se uma task depende de outra ainda não implementada:

**não finja que a dependência existe.**

Se for necessário utilizar dados temporários:

- use fixture isolado;
- identifique claramente que é temporário;
- mantenha fácil substituição pela API real;
- não apresente mock como integração concluída.

Exemplo:

```ts
// TODO(T029): replace this fixture with the triage queue API after it is merged.
```

---

## 12. Figma é a fonte de verdade visual

Arquivo oficial do projeto:

```text
https://www.figma.com/design/WjMoH9ToCExJLjpuDisGf6/Mapeia-Focos
```

Quando uma task mencionar uma tela existente no Figma:

**inspecione o frame exato antes de implementar.**

Não desenvolva a interface somente com base em:

- descrição da task;
- screenshot;
- memória;
- tela semelhante;
- interpretação própria.

A task define principalmente comportamento e critérios de aceite.

O Figma define principalmente a aparência e estrutura visual.

---

## 13. Fidelidade visual

Preserve:

- hierarquia;
- espaçamentos;
- cores;
- bordas;
- raios;
- tipografia;
- textos;
- ícones;
- estados;
- posicionamento;
- feedbacks visuais.

Não redesenhe ou "melhore" uma interface sem solicitação.

---

## 14. Responsividade

As dimensões do Figma são referências e não devem ser tratadas automaticamente como dimensões fixas da aplicação.

Um frame mobile de:

```text
390px
```

não significa:

```tsx
className="w-[390px]"
```

para toda a página.

Prefira:

```tsx
className="w-full"
```

e utilize `max-width` quando apropriado.

Interfaces desktop também devem permanecer funcionais em diferentes larguras de notebook e monitor.

---

## 15. Design System

Antes de criar:

- cor;
- raio;
- espaçamento;
- componente visual;
- estilo de status;

verifique se já existe solução equivalente no Figma ou no projeto.

Evite criar valores "quase iguais".

Não altere globalmente o Design System durante uma task que não tenha esse objetivo.

---

## 16. Tipografia

O Figma utiliza **Atkinson Hyperlegible Next** em diferentes interfaces.

Mudanças globais de tipografia só devem ser feitas quando fizerem parte da task ou tiverem sido explicitamente aprovadas.

Não troque fontes como efeito colateral de outra implementação.

---

## 17. Ícones

Prefira:

```text
lucide-react
```

quando houver um ícone equivalente ao protótipo.

Não instale outra biblioteca apenas para obter um ícone.

Assets específicos da identidade devem utilizar o arquivo correto do projeto.

---

## 18. Estado React

Evite múltiplas fontes de verdade.

Se várias partes da UI representam o mesmo estado, use uma única fonte.

Exemplo:

```ts
const [selectedOccurrenceId, setSelectedOccurrenceId] =
  useState<string>();
```

Fila, mapa e painel devem derivar da mesma seleção.

Não crie:

```text
selectedCard
selectedPin
selectedPanelOccurrence
```

quando todos representam a mesma ocorrência.

---

## 19. Rascunho de ocorrência

Utilize as abstrações existentes do controller:

```ts
saveOccurrenceDraft();
getOccurrenceDraft();
getOccurrenceDraftSnapshot();
subscribeToOccurrenceDraft();
clearOccurrenceDraft();
```

Não acesse diretamente a chave interna do `sessionStorage` em componentes quando já houver abstração.

---

## 20. Mídias e arquivos

Objetos `File` não devem ser serializados em:

```text
localStorage
sessionStorage
```

Considere corretamente:

- ida e volta entre telas;
- reload;
- retry;
- falha parcial;
- conclusão do envio.

Não crie uma segunda ocorrência apenas porque o upload das mídias da primeira falhou.

---

## 21. Forms e validação

Utilize preferencialmente:

```text
React Hook Form + Zod
```

quando adequado ao fluxo existente.

Identificadores continuam em inglês:

```ts
const occurrenceSchema = z.object({
  address: z.string(),
});
```

Mensagens de validação permanecem em PT-BR:

```ts
address: z
  .string()
  .min(3, "O endereço deve conter no mínimo 3 caracteres.");
```

---

## 22. Feedback e erros

Nunca apresente sucesso antes da confirmação real da operação.

Considere estados de:

- loading;
- success;
- error;
- empty;
- retry;
- partial failure.

Não faça:

- toast de sucesso após erro;
- redirecionamento de sucesso quando o POST falhou;
- confirmação de localização antes da Geolocation API responder.

---

## 23. Acessibilidade

Toda implementação deve considerar:

- HTML semântico;
- navegação por teclado;
- foco visível;
- contraste;
- labels;
- `aria-label`;
- textos alternativos;
- estados `disabled`;
- áreas de interação adequadas.

Evite:

```tsx
<div onClick={handleClick}>
```

quando a ação deveria ser:

```tsx
<button type="button" onClick={handleClick}>
```

---

## 24. TypeScript

O projeto utiliza TypeScript em modo estrito.

Evite:

```text
any
as unknown as X
```

para esconder incompatibilidades.

Resolva o contrato corretamente.

Use o alias interno:

```text
@/
```

Exemplo:

```ts
import type { OccurrenceResponse } from "@/types/occurrence";
```

---

## 25. Refatorações e problemas fora da task

Esta regra é obrigatória.

Se durante uma task a IA encontrar:

- código duplicado;
- dívida técnica;
- bug não relacionado;
- oportunidade de refatoração;
- arquivo mal organizado;
- inconsistência arquitetural;
- melhoria de performance;
- melhoria de acessibilidade;
- código legado;
- documentação desatualizada;
- oportunidade de reorganização;

**não deve alterar automaticamente.**

Primeiro deve informar o usuário/equipe.

Use este formato quando necessário:

```text
Finding:
<problema encontrado>

Impact:
<por que isso importa>

Suggested change:
<alteração recomendada>

Scope:
Fora da task atual. Nenhuma alteração realizada.
```

Somente faça a alteração depois de aprovação explícita.

---

## 26. Refatorações necessárias para a própria task

Uma pequena refatoração pode ser realizada sem aprovação adicional apenas quando:

- for diretamente necessária para concluir a task;
- estiver localizada no código afetado;
- não modificar comportamento externo;
- não alterar arquitetura;
- não afetar outros fluxos;
- mantiver o diff pequeno.

Caso contrário:

**sugira primeiro.**

---

## 27. Regra de escopo

Antes de alterar qualquer arquivo, pergunte:

> Esta alteração é necessária para atender à task ou aos seus critérios de aceite?

Se não for:

**não altere sem aprovação explícita.**

Não aproveite uma feature para:

- reorganizar outras telas;
- renomear arquivos não relacionados;
- alterar componentes de outro fluxo;
- atualizar dependências;
- modificar Design System;
- fazer limpeza geral.

---

## 28. Variáveis de ambiente

O frontend utiliza:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

A configuração local deve ficar em:

```text
.env.local
```

O `.env.example` deve documentar as variáveis necessárias.

Nunca versione segredos.

Variáveis `NEXT_PUBLIC_*` ficam disponíveis no navegador.

Nunca coloque:

- senhas;
- tokens privados;
- secrets;
- credenciais administrativas;

em `NEXT_PUBLIC_*`.

---

## 29. Dependências

Antes de instalar biblioteca:

1. confirme se já existe solução no projeto;
2. confirme se ela é realmente necessária;
3. avalie impacto no bundle;
4. respeite a arquitetura atual.

Não introduza automaticamente:

- nova biblioteca de estado;
- framework de UI;
- biblioteca de mapas;
- biblioteca de ícones;
- nova solução de forms.

---

## 30. Testes

Não introduza nova infraestrutura de testes sem solicitação.

Se a task exigir testes, siga o padrão definido pela equipe.

Mesmo sem testes automatizados, os critérios de aceite devem ser verificados manualmente.

---

## 31. Validação obrigatória

Antes de considerar uma alteração concluída:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Todos devem passar.

Quando houver alteração de dependências:

```bash
npm audit --omit=dev
```

Não execute automaticamente:

```bash
npm audit fix --force
```

---

## 32. Validação funcional

Build verde não substitui teste do fluxo.

Teste:

- caminho principal;
- navegação;
- retorno;
- loading;
- erro;
- empty state;
- retry;
- persistência;
- critérios de aceite.

---

## 33. Git

Antes de iniciar uma task:

```bash
git status
git branch --show-current
```

Não descarte alterações existentes.

Branch principal do frontend:

```text
main
```

Atualize a base antes de iniciar uma nova task quando apropriado.

---

## 34. Branches

Use uma branch por task sempre que possível.

Exemplos:

```text
feat/T027-central-operacional
fix/T017-location
chore/T031-legacy-cleanup
```

Não misture funcionalidades independentes.

---

## 35. Commits

**Não faça commits sem solicitação explícita do usuário/desenvolvedor.**

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

sem autorização.

---

## 36. Operações destrutivas

Nunca execute automaticamente:

```bash
git reset --hard
git clean -fd
git push --force
git rebase
```

Não apague alterações locais do desenvolvedor.

---

## 37. Pull Requests

Uma PR deve conter apenas alterações relacionadas à task.

A descrição deve informar:

- task;
- objetivo;
- principais alterações;
- decisões relevantes;
- dependências;
- validações realizadas;
- limitações conhecidas.

Nunca declare uma validação que não foi executada.

---

## 38. Código gerado por IA

Antes de entregar código:

- remova imports não usados;
- remova código morto criado pela task;
- remova `console.log`;
- remova placeholders acidentais;
- remova mocks indevidos;
- confira tipos;
- confira contrato da API;
- confira fidelidade ao Figma;
- confirme código em inglês;
- confirme mensagens em PT-BR.

Não faça limpeza geral de código antigo sem aprovação.

---

## 39. Workflow obrigatório

### 1. Ler a task

Entenda:

- objetivo;
- critérios de aceite;
- dependências.

### 2. Conferir Git

```bash
git status
git branch --show-current
```

### 3. Inspecionar código existente

Não recrie algo que já existe.

### 4. Consultar o Figma

Quando houver interface, abra o frame exato.

### 5. Conferir backend

Quando houver integração, valide o contrato real.

### 6. Delimitar escopo

Determine quais arquivos realmente precisam ser alterados.

### 7. Implementar

Faça apenas o necessário.

### 8. Reportar findings externos

Sugira melhorias fora do escopo.

Não implemente sem aprovação.

### 9. Validar idioma

```text
Code = English
User-facing content = PT-BR
```

### 10. Validar tecnicamente

```bash
npx tsc --noEmit
npm run lint
npm run build
```

### 11. Testar o fluxo

Confira critérios de aceite.

### 12. Revisar o diff

```bash
git status
git diff
```

Todo arquivo alterado deve pertencer à task ou ter sido explicitamente aprovado.

---

## 40. Definition of Done

Uma task frontend só está pronta quando:

- [ ] critérios de aceite foram atendidos;
- [ ] Figma foi consultado quando aplicável;
- [ ] arquitetura foi preservada;
- [ ] contrato real da API foi utilizado;
- [ ] nenhum endpoint foi inventado;
- [ ] código está em inglês;
- [ ] textos apresentados ao usuário estão em PT-BR;
- [ ] responsividade foi considerada;
- [ ] acessibilidade foi considerada;
- [ ] loading/error/empty/retry relevantes foram tratados;
- [ ] não há imports não utilizados;
- [ ] não há código morto introduzido pela task;
- [ ] não há `console.log`;
- [ ] `npx tsc --noEmit` passou;
- [ ] `npm run lint` passou;
- [ ] `npm run build` passou;
- [ ] fluxo funcional foi testado;
- [ ] diff contém somente mudanças relacionadas à task;
- [ ] findings externos foram apenas sugeridos;
- [ ] nenhuma refatoração fora de escopo foi feita sem aprovação;
- [ ] nenhum commit foi criado sem autorização.

---

## 41. Regra final

Quando houver dúvida visual:

> Consulte o Figma.

Quando houver dúvida sobre integração:

> Consulte o backend.

Quando houver dúvida entre criar e reutilizar:

> Investigue primeiro o que já existe.

Quando encontrar algo errado fora da task:

> Informe e sugira. Não altere sem aprovação.

Quando quiser refatorar:

> Verifique se é indispensável para a task. Se não for, peça aprovação.

Quando houver dúvida sobre idioma:

> Código, identificadores e comentários técnicos em inglês.  
> Conteúdo apresentado ao usuário em Português do Brasil.

Quando houver dúvida sobre escopo:

> Faça a menor alteração correta necessária para cumprir a task.

O objetivo é produzir frontend **confiável, consistente, acessível, fiel ao Figma, integrado corretamente ao backend e previsível para toda a equipe**.