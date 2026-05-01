-- CreateEnum
CREATE TYPE "BudgetTipo" AS ENUM ('SOFTWARE', 'HARDWARE');

-- CreateEnum
CREATE TYPE "BudgetCategoria" AS ENUM ('UPGRADE', 'REPARO', 'MANUTENCAO');

-- CreateEnum
CREATE TYPE "BudgetStatus" AS ENUM ('PENDENTE', 'GERADO');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Budget" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tipo" "BudgetTipo" NOT NULL,
    "categoria" "BudgetCategoria" NOT NULL,
    "descricao_cliente" TEXT NOT NULL,
    "total_estimado" DECIMAL(65,30) NOT NULL,
    "status" "BudgetStatus" NOT NULL DEFAULT 'PENDENTE',
    "title" TEXT,
    "explanation" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetItem" (
    "id" UUID NOT NULL,
    "budgetId" UUID NOT NULL,
    "descricao" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "valor_unitario" DECIMAL(65,30) NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "BudgetItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetItem" ADD CONSTRAINT "BudgetItem_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
