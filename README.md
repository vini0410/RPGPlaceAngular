# RPGPlace - Frontend

Este é o frontend do projeto RPGPlace, uma aplicação para gerenciamento de mesas de RPG, desenvolvida com Angular.

## 1. Funcionalidades

- **Página de Apresentação:** Uma página inicial para apresentar a aplicação aos novos usuários.
- **Autenticação de Usuários:**
  - Cadastro de novos usuários.
  - Login de usuários existentes.
- **Dashboard:** A página principal para usuários autenticados, onde eles podem ver suas mesas e personagens.
- **Minha Conta:** Uma página onde os usuários podem gerenciar suas informações de perfil.
- **Sessão de Jogo:** A página onde o jogo de RPG acontece, com chat em tempo real e outras ferramentas.

## 2. Stack Tecnológica

- **Angular 20**
- **TypeScript**
- **RxJS**
- **Tailwind CSS**
- **StompJS e SockJS** (para WebSockets)

## 3. Como Iniciar o Projeto

### Pré-requisitos

- Node.js (v18 ou superior)
- npm

### Passos para Instalação

1.  **Clone o repositório:**
    ```bash
    git clone <url-do-repositorio>
    cd RPGPlaceAngular
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    - Crie um arquivo `environment.ts` em `src/environments` e adicione as seguintes variáveis:
      ```typescript
      export const environment = {
        production: false,
        apiUrl: 'http://localhost:8080'
      };
      ```

4.  **Execute a aplicação em modo de desenvolvimento:**
    ```bash
    npm start
    ```

   A aplicação estará disponível em `http://localhost:4200`. O comando `npm start` utiliza um proxy (definido em `proxy.conf.json`) para encaminhar as requisições da API para o backend, que se espera esteja rodando em `http://localhost:8080`.

### Scripts Disponíveis

| Comando           | Descrição                                                                 |
|-------------------|---------------------------------------------------------------------------|
| `npm start`       | Executa a aplicação em modo de desenvolvimento com proxy para o backend.    |
| `npm run build`   | Compila a aplicação para produção.                                        |
| `npm test`        | Executa os testes unitários.                                              |
| `npm run watch`   | Compila a aplicação em modo de desenvolvimento e observa as alterações nos arquivos. |

## 4. Padrões de UI/UX e Estilo

- **Layout Geral:** As páginas principais utilizam um layout consistente, com um cabeçalho e uma área de conteúdo principal.
- **Componentes:** A interface é construída com componentes reutilizáveis, que podem ser encontrados em `src/app/components`.
- **Estilo:** A estilização é feita com Tailwind CSS. As cores, fontes e espaçamentos são definidos no arquivo `tailwind.config.js`.
- **Responsividade:** A responsividade é tratada com os breakpoints padrão do Tailwind CSS.

## 5. Convenções e Padrões de Código

- **Gerenciamento de Estado:** O estado da aplicação é gerenciado através de serviços do Angular e RxJS.
- **Comunicação com a API:** As chamadas à API são feitas através de serviços, que utilizam o `HttpClient` do Angular.
- **Rotas Protegidas:** O `AuthGuard` é utilizado para proteger as rotas que exigem autenticação, redirecionando usuários não logados para a página de login.
- **Nomenclatura:** Os arquivos de componentes, serviços e outros seguem o padrão `kebab-case.ts`.

## 6. Estrutura do Projeto

```
/
├── src/
│   ├── app/
│   │   ├── components/ # Componentes reutilizáveis
│   │   ├── guards/     # Guards de rota
│   │   ├── models/     # Modelos de dados
│   │   ├── pages/      # Componentes de página
│   │   ├── services/   # Serviços (lógica de negócio e comunicação com API)
│   │   └── app.routes.ts # Definição de rotas
│   ├── assets/       # Arquivos estáticos
│   └── environments/ # Configurações de ambiente
├── angular.json    # Configurações do Angular CLI
└── package.json    # Dependências e scripts do projeto
```

## 7. Deployment

Para fazer o deploy da aplicação, você pode seguir os seguintes passos:

1.  **Faça o build do projeto:**
    ```bash
    npm run build
    ```
2.  **Inicie a aplicação em modo de produção:**
    O build gera os arquivos estáticos na pasta `dist/`. Você pode servir esses arquivos com qualquer servidor web.

Certifique-se de que as variáveis de ambiente estão configuradas no ambiente de produção.

## 8. Contribuição

Contribuições são bem-vindas! Se você encontrar um bug ou tiver uma sugestão de melhoria, por favor, abra uma issue no repositório do GitHub. Se você quiser contribuir com código, por favor, crie um fork do repositório e envie um pull request.
