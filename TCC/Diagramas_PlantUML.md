# Diagramas PlantUML — BudgetGenerator TCC
# Como usar: copie o bloco de código de cada seção em https://www.plantuml.com/plantuml/uml/
# ou em qualquer plugin PlantUML de VS Code / IntelliJ

---

======================== DIAGRAMA ER (Banco de Dados) ========================

```plantuml
@startuml Diagrama_ER
skinparam linetype ortho
skinparam classBackgroundColor #FAFAFA
skinparam classBorderColor #333333
skinparam classHeaderBackgroundColor #1B3C53
skinparam classHeaderFontColor #FFFFFF
skinparam defaultFontSize 12

entity "**User**" as User {
  * <u>id</u> : UUID <<PK>>
  --
  nome : VARCHAR(255)
  email : VARCHAR(255) <<UNIQUE>>
  senha : VARCHAR(255)
  telefone : VARCHAR(50) <<NULL>>
  avatarUrl : TEXT <<NULL>>
}

entity "**Budget**" as Budget {
  * <u>id</u> : UUID <<PK>>
  --
  <i>userId</i> : UUID <<FK>>
  tipo : ENUM(SOFTWARE, HARDWARE)
  categoria : ENUM(UPGRADE, REPARO, MANUTENCAO)
  descricao_cliente : TEXT
  total_estimado : DECIMAL(10,2)
  status : ENUM(PENDENTE, GERADO)
  title : VARCHAR(255) <<NULL>>
  technical_description : TEXT <<NULL>>
  cliente_nome : VARCHAR(255) <<NULL>>
  prestador_nome : VARCHAR(255) <<NULL>>
  criado_em : TIMESTAMP
}

entity "**BudgetItem**" as BudgetItem {
  * <u>id</u> : UUID <<PK>>
  --
  <i>budgetId</i> : UUID <<FK>>
  descricao : VARCHAR(500)
  quantidade : INTEGER
  unidade : VARCHAR(20)
  valor_unitario : DECIMAL(10,2)
  category : VARCHAR(50)
}

User ||--o{ Budget : "possui (1:N)"
Budget ||--|{ BudgetItem : "contém (1:N)"

note bottom of BudgetItem
  category = "Peça" | "Serviço"
  unidade = "un" | "hrs" | "m" | "kit"
end note

note right of Budget
  status evolui de PENDENTE para GERADO
  após resposta do Gemini ser salva
end note
@enduml
```

---

======================== DIAGRAMA DE CLASSES — CAMADA DE DOMÍNIO ========================

```plantuml
@startuml Classes_Dominio
skinparam classBackgroundColor #FAFAFA
skinparam classBorderColor #1B3C53
skinparam defaultFontSize 11
skinparam packageBackgroundColor #EEF2F5

package "Domain — Entities" {
  class Budget {
    +id: string
    +userId: string
    +tipo: BudgetTipo
    +categoria: BudgetCategoria
    +descricao_cliente: string
    +total_estimado: number
    +status: BudgetStatus
    +criado_em: Date
    +title?: string
    +technical_description?: string
    +items?: BudgetItem[]
    +user?: User
    +cliente_nome?: string
    +prestador_nome?: string
  }

  class BudgetItem {
    +id: string
    +budgetId: string
    +descricao: string
    +quantidade: number
    +unidade: string
    +valor_unitario: number
    +category: string
  }

  class User {
    +id: string
    +nome: string
    +email: string
    +senha: string
    +telefone?: string
    +avatarUrl?: string
  }

  enum BudgetTipo {
    SOFTWARE
    HARDWARE
  }

  enum BudgetCategoria {
    UPGRADE
    REPARO
    MANUTENCAO
  }

  enum BudgetStatus {
    PENDENTE
    GERADO
  }
}

package "Domain — Interfaces" {
  interface IBudgetRepository {
    +save(budget: Budget): Promise<void>
    +findById(id: string): Promise<Budget | null>
    +findByUserId(userId: string): Promise<Budget[]>
    +update(budget: Budget): Promise<Budget>
    +delete(id: string): Promise<void>
  }

  interface IUserRepository {
    +save(user: User): Promise<void>
    +findByEmail(email: string): Promise<User | null>
    +findById(id: string): Promise<User | null>
    +update(user: User): Promise<User>
  }

  interface IBudgetGenerator {
    +analyzePartsNeeded(desc: string, tipo: string, cat: string): Promise<PartsAnalysis>
    +generate(params: BudgetParams): Promise<BudgetOutput>
  }

  interface IPasswordHasher {
    +hash(password: string): Promise<string>
    +compare(password: string, hash: string): Promise<boolean>
  }
}

Budget "1" *-- "N" BudgetItem : contains
Budget --> BudgetTipo
Budget --> BudgetCategoria
Budget --> BudgetStatus
User "1" -- "N" Budget : owns
@enduml
```

---

======================== DIAGRAMA DE CASO DE USO ========================

```plantuml
@startuml Caso_de_Uso
left to right direction
skinparam actorBackgroundColor #D4E8F5
skinparam usecaseBackgroundColor #FAFAFA
skinparam usecaseBorderColor #1B3C53
skinparam defaultFontSize 12

actor "Prestador\nde Serviço" as PS
actor "Google\nGemini API" as AI <<external>>
actor "Marketplaces\n(ML, KaBuM, Pichau, Terabyte)" as MKT <<external>>

rectangle "Sistema BudgetGenerator" {
  package "Acesso Público" {
    usecase "UC01 — Cadastrar-se" as UC1
    usecase "UC02 — Fazer Login" as UC2
  }

  package "Gestão de Conta" {
    usecase "UC03 — Atualizar Perfil" as UC3
    usecase "UC04 — Alterar Senha" as UC4
  }

  package "Orçamentos" {
    usecase "UC05 — Gerar Orçamento com IA" as UC5
    usecase "UC06 — Listar Orçamentos" as UC6
    usecase "UC07 — Visualizar Orçamento" as UC7
    usecase "UC08 — Editar Orçamento" as UC8
    usecase "UC09 — Excluir Orçamento" as UC9
    usecase "UC10 — Baixar PDF" as UC10
    usecase "UC11 — Analisar Necessidade\nde Peças (IA)" as UC11
    usecase "UC12 — Pesquisar Preços\nem Tempo Real" as UC12
    usecase "UC13 — Gerar Proposta\ncom IA" as UC13
  }

  package "Analytics" {
    usecase "UC14 — Ver Dashboard\nde Métricas" as UC14
  }
}

PS --> UC1
PS --> UC2
PS --> UC3
PS --> UC4
PS --> UC5
PS --> UC6
PS --> UC7
PS --> UC8
PS --> UC9
PS --> UC10
PS --> UC14

UC5 .> UC11 : <<include>>
UC5 .> UC13 : <<include>>
UC5 .> UC12 : <<extend>>\n[se needs_parts = true]

UC11 --> AI : Chamada 1
UC13 --> AI : Chamada 2
UC12 --> MKT
@enduml
```

---

======================== DIAGRAMA DE SEQUÊNCIA — AUTENTICAÇÃO ========================

```plantuml
@startuml Sequencia_Autenticacao
skinparam sequenceArrowThickness 2
skinparam sequenceParticipantBackgroundColor #FAFAFA
skinparam sequenceParticipantBorderColor #1B3C53
skinparam defaultFontSize 11

actor "Usuário" as U
participant "Angular\nFrontend" as FE
participant "AuthController\n[Presentation]" as AC
participant "AuthenticateUserUseCase\n[Application]" as UC
participant "PrismaUserRepository\n[Infrastructure]" as REPO
participant "BcryptPasswordHasher\n[Infrastructure]" as BCRYPT
database "PostgreSQL\n[Docker]" as DB

U -> FE : Inserir e-mail e senha → clicar em Login
FE -> AC : POST /login\n{email, senha}
AC -> UC : execute({email, senha})

UC -> REPO : findByEmail(email)
REPO -> DB : SELECT * FROM "User" WHERE email = ?
DB --> REPO : User row
REPO --> UC : User entity

UC -> BCRYPT : compare(senha, user.senha)
BCRYPT --> UC : boolean

alt Credenciais válidas
  UC --> AC : {token: JWT, user: {id, nome, email}}
  AC --> FE : 200 OK {token, user}
  FE -> FE : localStorage.setItem('token', token)
  FE --> U : Redirecionar para dashboard
else Credenciais inválidas
  UC --> AC : throw AppError(401, "Credenciais inválidas")
  AC --> FE : 401 Unauthorized {message}
  FE --> U : Exibir mensagem de erro
end
@enduml
```

---

======================== DIAGRAMA DE SEQUÊNCIA — GERAÇÃO DE ORÇAMENTO ========================

```plantuml
@startuml Sequencia_Geracao_Orcamento
skinparam sequenceArrowThickness 2
skinparam sequenceParticipantBackgroundColor #FAFAFA
skinparam sequenceParticipantBorderColor #1B3C53
skinparam defaultFontSize 10

actor "Prestador" as PS
participant "Angular\nFrontend" as FE
participant "BudgetController\n[Presentation]" as BC
participant "GenerateBudget\nUseCase\n[Application]" as GUC
participant "GeminiBudget\nService\n[Infrastructure]" as GEMINI
participant "PriceResearch\nService\n[Infrastructure]" as PRS
participant "PrismaBudget\nRepository\n[Infrastructure]" as REPO
participant "Google\nGemini API" as GAPI <<external>>
participant "Marketplaces\n(4 fontes)" as MKT <<external>>
database "PostgreSQL" as DB

PS -> FE : Preencher formulário → clicar "Solicitar com IA"
FE -> BC : POST /api/budgets\n{tipo, categoria, descricao, showPartsDetail, ...}
note right of BC: Middleware ensureAuthenticated\nvalida JWT e injeta userId

BC -> GUC : execute(GenerateBudgetDTO)

group Etapa 1 — Análise de Contexto [Gemini Chamada 1]
  GUC -> GEMINI : analyzePartsNeeded(descricao, tipo, categoria)
  GEMINI -> GAPI : POST /generateContent\n[Prompt: análise de peças]
  GAPI --> GEMINI : JSON {needs_parts, parts[]}
  GEMINI --> GUC : PartsAnalysis
end

alt needs_parts == true
  group Etapa 2 — Pesquisa de Preços [Paralela]
    GUC -> PRS : researchMany(parts[])
    PRS -> MKT : Busca paralela em ML + KaBuM + Pichau + Terabyte\n(timeout 8s por fonte)
    MKT --> PRS : Preços encontrados (0 a N por fonte)
    PRS --> GUC : PartResearch[] {partName, cheapest[3], average}
  end
else needs_parts == false
  GUC -> GUC : partsResearch = undefined
end

group Etapa 3 — Geração do Orçamento [Gemini Chamada 2]
  GUC -> GEMINI : generate({tipo, categoria, descricao,\nshowPartsDetail, partsResearch})
  GEMINI -> GAPI : POST /generateContent\n[Prompt: orçamento com contexto de preços]

  alt Gemini retorna 200 OK
    GAPI --> GEMINI : JSON {title, technical_description,\ntotal_estimado, items[]}
    GEMINI --> GUC : BudgetOutput
  else Gemini retorna 503
    GAPI --> GEMINI : 503 Service Unavailable
    loop Retry (máx 3x, delays: 3s / 6s / 9s)
      GEMINI -> GAPI : Tentativa de retry
      GAPI --> GEMINI : 200 OK (ou novo 503)
    end
  end
end

GUC -> REPO : save(Budget + BudgetItems[])
REPO -> DB : INSERT INTO Budget + BudgetItem
DB --> REPO : Confirmação
REPO --> GUC : void

GUC --> BC : Budget entity (completo)
BC --> FE : 201 Created {budget}
FE -> FE : Atualizar lista de orçamentos
FE --> PS : Exibir orçamento gerado na lista
@enduml
```

---

======================== DIAGRAMA DE COMPONENTES — CLEAN ARCHITECTURE ========================

```plantuml
@startuml Componentes_Clean_Architecture
skinparam componentStyle rectangle
skinparam componentBackgroundColor #FAFAFA
skinparam packageBackgroundColor #EEF2F5
skinparam packageBorderColor #1B3C53
skinparam defaultFontSize 11

package "Presentation Layer\n(controllers, middlewares)" #D4E8F5 {
  [BudgetController]
  [AuthController]
  [UserController]
  [ensureAuthenticated] <<middleware>>
  [errorMiddleware] <<middleware>>
}

package "Application Layer\n(use cases, DTOs)" #D4F5E4 {
  [GenerateBudgetUseCase]
  [ListUserBudgetsUseCase]
  [GetBudgetByIdUseCase]
  [DeleteBudgetUseCase]
  [UpdateBudgetUseCase]
  [GetBudgetStatsUseCase]
  [AuthenticateUserUseCase]
  [RegisterUserUseCase]
  [GetUserProfileUseCase]
  [UpdateUserProfileUseCase]
  [UpdateUserPasswordUseCase]
}

package "Domain Layer\n(entities, interfaces)" #FFF9D4 {
  [Budget Entity]
  [BudgetItem Entity]
  [User Entity]
  [IBudgetRepository] <<interface>>
  [IUserRepository] <<interface>>
  [IBudgetGenerator] <<interface>>
  [IPasswordHasher] <<interface>>
}

package "Infrastructure Layer\n(concrete implementations)" #F5D4D4 {
  [PrismaBudgetRepository]
  [PrismaUserRepository]
  [GeminiBudgetService]
  [PriceResearchService]
  [BcryptPasswordHasher]
  [prismaClient] <<singleton>>
}

cloud "External Services" {
  [Google Gemini API] <<external>>
  [Mercado Livre API] <<external>>
  [KaBuM / Pichau / Terabyte] <<external>>
}

database "PostgreSQL\n(Docker)" as PG

' Presentation → Application
[BudgetController] --> [GenerateBudgetUseCase]
[BudgetController] --> [ListUserBudgetsUseCase]
[BudgetController] --> [GetBudgetByIdUseCase]
[BudgetController] --> [DeleteBudgetUseCase]
[BudgetController] --> [UpdateBudgetUseCase]
[BudgetController] --> [GetBudgetStatsUseCase]
[AuthController] --> [AuthenticateUserUseCase]
[UserController] --> [GetUserProfileUseCase]
[UserController] --> [UpdateUserProfileUseCase]
[UserController] --> [UpdateUserPasswordUseCase]

' Application → Domain (interfaces)
[GenerateBudgetUseCase] --> [IBudgetRepository]
[GenerateBudgetUseCase] --> [IBudgetGenerator]
[GenerateBudgetUseCase] --> [PriceResearchService]
[ListUserBudgetsUseCase] --> [IBudgetRepository]
[AuthenticateUserUseCase] --> [IUserRepository]
[AuthenticateUserUseCase] --> [IPasswordHasher]
[RegisterUserUseCase] --> [IUserRepository]
[RegisterUserUseCase] --> [IPasswordHasher]

' Infrastructure implements Domain interfaces
[IBudgetRepository] <|.. [PrismaBudgetRepository]
[IUserRepository] <|.. [PrismaUserRepository]
[IBudgetGenerator] <|.. [GeminiBudgetService]
[IPasswordHasher] <|.. [BcryptPasswordHasher]

' Infrastructure → External
[PrismaBudgetRepository] --> [prismaClient]
[PrismaUserRepository] --> [prismaClient]
[prismaClient] --> PG
[GeminiBudgetService] --> [Google Gemini API]
[PriceResearchService] --> [Mercado Livre API]
[PriceResearchService] --> [KaBuM / Pichau / Terabyte]
@enduml
```

---

======================== DIAGRAMA DE IMPLANTAÇÃO (DEPLOYMENT) ========================

```plantuml
@startuml Diagrama_Implantacao
skinparam nodeBackgroundColor #FAFAFA
skinparam nodeBorderColor #1B3C53
skinparam defaultFontSize 11
skinparam cloudBackgroundColor #EEF2F5

node "Máquina do Desenvolvedor\n(Windows 11 / Linux / macOS)" as DEV {

  node "Docker Engine" as DOCKER {
    node "budget_generator_postgres\n(postgres:15-alpine)" as PGNODE {
      database "PostgreSQL\nporta interna: 5432" as PGDB
    }
  }

  node "Node.js Process\nporta: 3000" as BACKEND {
    component "Express.js\nHTTP Server" as EXPRESS
    component "Prisma\nClient" as PRISMA
    component "GeminiBudget\nService" as GBS
    component "PriceResearch\nService" as PRS

    EXPRESS --> PRISMA
    EXPRESS --> GBS
    EXPRESS --> PRS
    PRISMA --> PGDB : TCP 5434→5432
  }

  node "Angular Dev Server\n(ng serve)\nporta: 4200" as FRONTEND {
    component "Angular 19 SPA\n(TypeScript compiled)" as SPA
    component "jsPDF\n(PDF generation)" as PDF

    SPA --> PDF
  }

  SPA --> EXPRESS : HTTP /api/** (proxy)\nlocalhost:3000
}

cloud "Google Cloud\n(api.generativelanguage.googleapis.com)" as GCLOUD {
  component "Gemini API\n(gemini-2.5-flash)" as GEMINI_API
}

cloud "Marketplaces Brasileiros" as MKTS {
  component "Mercado Livre API\n(api.mercadolibre.com)" as ML_API
  component "KaBuM\nPichau\nTerabyteShop" as LOJAS
}

GBS --> GEMINI_API : HTTPS (POST /generateContent)
PRS --> ML_API : HTTPS (GET /search)
PRS --> LOJAS : HTTPS (GET + HTML scraping)

actor "Prestador de Serviço" as USER
USER --> SPA : HTTP\n(Browser → localhost:4200)
@enduml
```

---

======================== DIAGRAMA DE ATIVIDADES — GERAÇÃO DE ORÇAMENTO ========================

```plantuml
@startuml Atividades_Geracao
skinparam activityBackgroundColor #FAFAFA
skinparam activityBorderColor #1B3C53
skinparam defaultFontSize 11
skinparam arrowColor #1B3C53

|#D4E8F5|Usuário (Frontend)|
|#D4F5E4|Backend — Use Case|
|#FFF9D4|Gemini Service|
|#F5E8D4|Price Research Service|

|Usuário (Frontend)|
start
:Preencher formulário:\ntipo, categoria, descrição,\nshowPartsDetail, nomes;
:Clicar "Solicitar com IA";
:Exibir spinner de carregamento;

|Backend — Use Case|
:Receber POST /api/budgets;
:Validar token JWT (middleware);
:Instanciar GenerateBudgetUseCase;

|Gemini Service|
:analyzePartsNeeded()\n→ Chamada 1 ao Gemini;

if (needs_parts == true?) then (SIM)

  |Price Research Service|
  :researchMany(parts[])\nBuscas paralelas em:\n• Mercado Livre API\n• KaBuM (scraping)\n• Pichau (scraping)\n• TerabyteShop (scraping);
  :Filtrar preços válidos\n(R$10 a R$50.000);
  :Selecionar 3 menores por peça;
  :Calcular média;
  :Retornar PartResearch[];

else (NÃO)
  |Price Research Service|
  :partsResearch = undefined;
endif

|Gemini Service|
:generate()\n→ Chamada 2 ao Gemini\ncom contexto de preços;

if (Resposta OK?) then (SIM)
  :Parsear JSON do orçamento;
  :Validar estrutura\n(campos obrigatórios, valores > 0);

  |Backend — Use Case|
  :Criar entidade Budget\n+ BudgetItems[];
  :PrismaBudgetRepository.save();

  |Usuário (Frontend)|
  :Receber 201 Created;
  :Atualizar lista de orçamentos;
  :Exibir orçamento gerado;
  stop

else (NÃO — 503 Service Unavailable)
  |Gemini Service|
  if (tentativas < 3?) then (SIM)
    :Aguardar (3s / 6s / 9s)\ncallWithRetry();
    :Nova tentativa ao Gemini;
  else (NÃO — 3 tentativas esgotadas)
    |Backend — Use Case|
    :throw Error("Gemini indisponível");

    |Usuário (Frontend)|
    :Receber 500 Internal Server Error;
    :Exibir mensagem de erro ao usuário;
    stop
  endif
endif
@enduml
```

---

======================== DIAGRAMA DE CLASSES — CAMADA DE APLICAÇÃO (USE CASES) ========================

```plantuml
@startuml Classes_Application
skinparam classBackgroundColor #FAFAFA
skinparam classBorderColor #1B3C53
skinparam defaultFontSize 10
skinparam packageBackgroundColor #EEF2F5

package "Application — Use Cases" {

  class GenerateBudgetUseCase {
    -budgetRepository: IBudgetRepository
    -budgetGenerator: IBudgetGenerator
    -priceResearchService: PriceResearchService
    +execute(data: GenerateBudgetDTO): Promise<Budget>
  }

  class ListUserBudgetsUseCase {
    -budgetRepository: IBudgetRepository
    +execute(userId: string): Promise<Budget[]>
  }

  class GetBudgetByIdUseCase {
    -budgetRepository: IBudgetRepository
    +execute(id: string, userId: string): Promise<Budget>
  }

  class UpdateBudgetUseCase {
    -budgetRepository: IBudgetRepository
    +execute(id: string, userId: string, data: UpdateBudgetDTO): Promise<Budget>
  }

  class DeleteBudgetUseCase {
    -budgetRepository: IBudgetRepository
    +execute(id: string, userId: string): Promise<void>
  }

  class GetBudgetStatsUseCase {
    -budgetRepository: IBudgetRepository
    +execute(userId: string): Promise<BudgetStats>
  }

  class AuthenticateUserUseCase {
    -userRepository: IUserRepository
    -passwordHasher: IPasswordHasher
    +execute(data: AuthDTO): Promise<AuthResult>
  }

  class RegisterUserUseCase {
    -userRepository: IUserRepository
    -passwordHasher: IPasswordHasher
    +execute(data: RegisterDTO): Promise<User>
  }

  class UpdateUserProfileUseCase {
    -userRepository: IUserRepository
    +execute(userId: string, data: UpdateProfileDTO): Promise<User>
  }

  class UpdateUserPasswordUseCase {
    -userRepository: IUserRepository
    -passwordHasher: IPasswordHasher
    +execute(userId: string, data: UpdatePasswordDTO): Promise<void>
  }
}

package "DTOs" {
  class GenerateBudgetDTO {
    +userId: string
    +tipo: BudgetTipo
    +categoria: BudgetCategoria
    +descricao_cliente: string
    +showPartsDetail: boolean
    +cliente_nome?: string
    +prestador_nome?: string
  }

  class UpdateBudgetDTO {
    +title?: string
    +technical_description?: string
  }

  class AuthDTO {
    +email: string
    +senha: string
  }

  class AuthResult {
    +token: string
    +user: User
  }
}

GenerateBudgetUseCase ..> GenerateBudgetDTO : uses
UpdateBudgetUseCase ..> UpdateBudgetDTO : uses
AuthenticateUserUseCase ..> AuthDTO : uses
AuthenticateUserUseCase ..> AuthResult : returns
@enduml
```

---

======================== DIAGRAMA DE SEQUÊNCIA — EDIÇÃO DE ORÇAMENTO ========================

```plantuml
@startuml Sequencia_Edicao
skinparam sequenceArrowThickness 2
skinparam defaultFontSize 11

actor "Usuário" as U
participant "Angular\nFrontend" as FE
participant "BudgetController" as BC
participant "UpdateBudget\nUseCase" as UC
participant "PrismaBudget\nRepository" as REPO
database "PostgreSQL" as DB

U -> FE : Clicar em "Editar" no card do orçamento
FE -> FE : Abrir modal de edição\ncom campos title e technical_description
U -> FE : Editar campos e clicar "Salvar Alterações"

FE -> BC : PUT /api/budgets/:id\n{title, technical_description}\nAuthorization: Bearer <token>
BC -> BC : ensureAuthenticated: validar JWT
BC -> UC : execute(id, userId, {title, technical_description})

UC -> REPO : findById(id)
REPO -> DB : SELECT * FROM Budget WHERE id = ?
DB --> REPO : Budget row
REPO --> UC : Budget entity

alt Budget existe e pertence ao usuário
  UC -> REPO : update(budgetAtualizado)
  REPO -> DB : UPDATE Budget SET title = ?, technical_description = ?\nWHERE id = ? AND userId = ?
  DB --> REPO : Budget row atualizado
  REPO --> UC : Budget entity atualizado
  UC --> BC : Budget
  BC --> FE : 200 OK {budget}
  FE -> FE : Fechar modal\nAtualizar lista de orçamentos
  FE --> U : Toast "Orçamento salvo com sucesso"
else Budget não encontrado ou não pertence ao usuário
  UC --> BC : throw AppError(404)
  BC --> FE : 404 Not Found
  FE --> U : Exibir mensagem de erro
end
@enduml
```
