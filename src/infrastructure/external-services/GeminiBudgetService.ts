import { GoogleGenerativeAI } from '@google/generative-ai';
import { IBudgetGenerator, BudgetParams, BudgetOutput } from '../../domain/interfaces/IBudgetGenerator';

export class GeminiBudgetService implements IBudgetGenerator {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('A API Key do Gemini (GEMINI_API_KEY) não está definida nas variáveis de ambiente.');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async generate(params: BudgetParams): Promise<BudgetOutput> {
    const { tipo, categoria, descricao_cliente } = params;

    const prompt = `Você é um Consultor de TI Sênior especializado em prestação de serviços técnicos.
Seu objetivo é analisar a solicitação do cliente e gerar uma proposta de PRESTAÇÃO DE SERVIÇOS detalhada. O foco do orçamento DEVE SER OS SERVIÇOS EXECUTADOS (mão de obra), e não a venda de produtos. Em vez de listar peças (como "Placa de vídeo"), liste as tarefas técnicas necessárias (ex: "Desmontagem do equipamento", "Limpeza química", "Instalação física", "Configuração e testes").

Informações da Solicitação:
- Tipo: ${tipo} (Software/Hardware)
- Categoria: ${categoria} (Upgrade/Reparo/Manutencao)
- Descrição do Cliente: "${descricao_cliente}"

INSTRUÇÕES CRÍTICAS PARA O RETORNO:
1. Retorne SOMENTE um objeto JSON válido, sem qualquer texto adicional
2. NÃO inclua blocos de código markdown
3. NUNCA inclua quebras de linha dentro de strings - use espaços em vez disso
4. Todas as strings devem usar aspas duplas
5. Números devem ser valores numéricos, NÃO strings

Estrutura JSON obrigatória:
{
  "title": "Um título comercial impactante focado no serviço a ser prestado",
  "technical_description": "Breve descrição (máximo 1 frase) clara e objetiva",
  "total_estimado": 0,
  "items": [
    {
      "descricao": "Taxa de Diagnóstico (se aplicável)",
      "quantidade": 1,
      "unidade": "un",
      "valor_unitario": 0,
      "category": "Serviço"
    }
  ]
}

Instruções Detalhadas:
- title: Título curto e focado no serviço
- technical_description: TEXTO EXTREMAMENTE CURTO, MÁXIMO DE 1 FRASE. Seja direto. Ex: "Diagnóstico e reparo de sistema corrompido." NÃO enrole e NÃO faça descrições gigantes.
- total_estimado: Soma de todos os valores (quantidade x valor_unitario)
- items: SEPARE TODOS OS CUSTOS EM ITENS NESTA LISTA. Se a solicitação envolver análise (ex: diagnosticar Windows corrompido), INCLUA OBRIGATORIAMENTE um item de "Taxa de Diagnóstico" ou "Análise Técnica" com o seu devido valor real em Reais (BRL). Liste TODOS os custos com valores realistas (BRL). A tabela será gerada com base nestes itens, liste tudo (diagnóstico, mão de obra, peças, etc). Inclua o campo "unidade" (ex: "un", "hrs", "m").

EXEMPLO DE RESPOSTA ESPERADA:
{
  "title": "Manutenção Preventiva e Limpeza de Hardware",
  "technical_description": "Proposta para prestação de serviços de manutenção técnica, limpeza química e troca de pasta térmica.",
  "total_estimado": 350,
  "items": [
    {
      "descricao": "Desmontagem completa e limpeza química de contatos",
      "quantidade": 1,
      "unidade": "un",
      "valor_unitario": 150,
      "category": "Serviço"
    },
    {
      "descricao": "Troca de pasta térmica (CPU/GPU) de alta performance",
      "quantidade": 1,
      "unidade": "un",
      "valor_unitario": 120,
      "category": "Serviço"
    },
    {
      "descricao": "Testes de estresse e validação de temperatura",
      "quantidade": 1,
      "unidade": "un",
      "valor_unitario": 80,
      "category": "Serviço"
    }
  ]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const outputText = result.response.text();

      return this.parseResponse(outputText);
    } catch (error) {
      throw new Error(`Falha ao comunicar com a API do Gemini: ${(error as Error).message}`);
    }
  }

  private parseResponse(text: string): BudgetOutput {
    try {
      // Passo 1: Remover blocos de código markdown
      let cleanedText = text.replace(/```json/gi, '').replace(/```/gi, '').trim();

      // Passo 2: Extrair apenas o JSON se houver texto antes/depois
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }

      // Passo 3: Limpar quebras de linha (substituir por espaço)
      cleanedText = cleanedText.replace(/[\r\n]+/g, ' ');

      // Passo 4: Normalizar múltiplos espaços
      cleanedText = cleanedText.replace(/\s+/g, ' ');

      // Passo 5: Parse JSON
      const parsedData = JSON.parse(cleanedText);

      // Passo 6: Validar estrutura básica
      if (
        !parsedData ||
        typeof parsedData !== 'object' ||
        typeof parsedData.title !== 'string' ||
        typeof parsedData.technical_description !== 'string' ||
        typeof parsedData.total_estimado !== 'number' ||
        !Array.isArray(parsedData.items)
      ) {
        throw new Error(
          'Estrutura inválida. Campos obrigatórios: title (string), technical_description (string), total_estimado (number), items (array)'
        );
      }

      // Passo 7: Validar items não vazio
      if (parsedData.items.length === 0) {
        throw new Error('Deve haver ao menos um item na proposta.');
      }

      // Passo 8: Validar e normalizar cada item
      parsedData.items.forEach((item: any, index: number) => {
        // Validar tipos
        if (
          typeof item.descricao !== 'string' ||
          typeof item.quantidade !== 'number' ||
          typeof item.unidade !== 'string' ||
          typeof item.valor_unitario !== 'number' ||
          typeof item.category !== 'string'
        ) {
          throw new Error(
            `Item [${index}] inválido. Campos: descricao (string), quantidade (number), unidade (string), valor_unitario (number), category (string)`
          );
        }

        // Normalizar quantidade para inteiro
        item.quantidade = Math.round(item.quantidade);

        // Validar valores positivos
        if (item.quantidade <= 0) {
          throw new Error(`Item [${index}]: quantidade deve ser maior que 0`);
        }
        if (item.valor_unitario <= 0) {
          throw new Error(`Item [${index}]: valor_unitario deve ser maior que 0`);
        }

        // Validar strings não vazias
        if (item.descricao.trim().length === 0) {
          throw new Error(`Item [${index}]: descricao não pode estar vazia`);
        }
        if (item.category.trim().length === 0) {
          throw new Error(`Item [${index}]: category não pode estar vazia`);
        }
      });

      // Passo 9: Validações finais do objeto
      if (!parsedData.title || parsedData.title.trim().length === 0) {
        throw new Error('Title não pode estar vazio');
      }

      if (!parsedData.technical_description || parsedData.technical_description.trim().length === 0) {
        throw new Error('Technical description não pode estar vazio');
      }

      if (parsedData.total_estimado <= 0) {
        throw new Error('Total estimado deve ser maior que 0');
      }

      return parsedData as BudgetOutput;
    } catch (error) {
      console.error('Erro ao parsear resposta do Gemini:', {
        textLength: text.length,
        firstChars: text.substring(0, 100),
        errorMessage: (error as Error).message
      });

      throw new Error(`Falha ao processar JSON do Gemini: ${(error as Error).message}`);
    }
  }
}
