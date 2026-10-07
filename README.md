# Mapeia Focos

Fundação do frontend Mapeia Focos, organizada a partir da arquitetura do projeto de referência IFome.

## Requisitos

- Node.js 24 (conforme especificado no `.nvmrc` e `package.json`)
- npm

## Comandos

```bash
npm install
npm run dev
npm run lint
npm run build
npm start
```

## Organização

- `src/app`: rotas e arquivos globais do App Router
- `src/components`: componentes compartilhados e por domínio
- `src/hooks`: hooks de aplicação e consulta de dados
- `src/controllers`: transformação e coordenação de dados
- `src/services/api` e `src/services/mocks`: integrações e substitutos locais
- `src/schemas`: validação de dados
- `src/types`: tipos compartilhados
- `src/utils`: utilitários
- `src/lib`: infraestrutura e configuração compartilhada
- `public`: arquivos estáticos

Não há variáveis de ambiente definidas nesta fundação. Arquivos `.env*` permanecem ignorados pelo Git, conforme o padrão de referência.
