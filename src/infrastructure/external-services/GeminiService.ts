import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  IBudgetGeneratorService,
  BudgetRequest,
  BudgetResponse
} from '../../domain/interfaces/IBudgetGeneratorService';

export class GeminiService implements IBudgetGeneratorService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('A variável GEMINI_API_KEY não está definida no arquivo .env');
    }
    // Inicializa o SDK do Google AI com a chave da API
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateBudget(request: BudgetRequest): Promise<BudgetResponse> {
    // Definimos explicitamente que a saída será em formato de JSON
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });

    const prompt = `
      Atue como um especialista técnico de orçamentos. 
      O cliente ${request.detalhesUsuario.nome} (Contato: ${request.detalhesUsuario.email}) solicitou um orçamento para o serviço do tipo: "${request.opcao}".
      
      Observações adicionais do pedido: ${request.observacoes || 'Nenhuma'}.
      
      Por favor, analise a solicitação e gere um orçamento plausível, condizente com os preços de mercado no Brasil, contendo os itens necessários (peças, ferramentas e/ou mão de obra) e seus respectivos valores estimados.
      
      O retorno deve ser ESTRITAMENTE um JSON válido, sem markdown envolvente, com a seguinte estrutura exata:
      {
        "itens": [
          {
            "descricao": "string (descrição clara do item ou do serviço prestado)",
            "valorEstimado": number (valor monetário em Reais, usando ponto para decimais)
          }
        ],
        "totalEstimado": number (soma exata de todos os valores apresentados na lista)
      }
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // O modelo irá retornar o texto diretamente estruturado como JSON
      const parsedData = JSON.parse(text) as BudgetResponse;
      return parsedData;
      
    } catch (error) {
      console.error('Erro ao chamar a API do Gemini:', error);
      throw new Error('Falha ao gerar o orçamento usando inteligência artificial.');
    }
  }
}
