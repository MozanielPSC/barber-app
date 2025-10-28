import { ComissaoProduto, ComissaoServico, Debito, Indicacao, ProjecaoComissoes, ResumoComissoes } from '../types';

export class ComissoesBusinessRules {
  /**
   * Calcula comissão de serviço para executor
   */
  static calcularComissaoServicoExecutor(
    valorServico: number,
    percentualComissao: number
  ): number {
    return (valorServico * percentualComissao) / 100;
  }

  /**
   * Calcula comissão de serviço para assistente
   */
  static calcularComissaoServicoAssistente(
    valorServico: number,
    percentualComissao: number
  ): number {
    return (valorServico * percentualComissao) / 100;
  }

  /**
   * Calcula comissão de indicação
   */
  static calcularComissaoIndicacao(
    valorServico: number,
    percentualComissao: number
  ): number {
    return (valorServico * percentualComissao) / 100;
  }

  /**
   * Calcula comissão de produto
   */
  static calcularComissaoProduto(
    valorProduto: number,
    quantidade: number,
    percentualComissao: number
  ): number {
    const valorTotal = valorProduto * quantidade;
    return (valorTotal * percentualComissao) / 100;
  }

  /**
   * Calcula resumo de comissões de um colaborador
   */
  static calcularResumoComissoes(
    colaboradorId: number,
    comissoesServicos: ComissaoServico[],
    comissoesProdutos: ComissaoProduto[],
    comissoesIndicacoes: Indicacao[],
    debitos: Debito[]
  ): ResumoComissoes {
    const comissoesServicosColaborador = comissoesServicos.filter(
      c => c.colaborador_id === colaboradorId
    );
    const comissoesProdutosColaborador = comissoesProdutos.filter(
      c => c.colaborador_id === colaboradorId
    );
    const comissoesIndicacoesColaborador = comissoesIndicacoes.filter(
      c => c.colaborador_id === colaboradorId
    );
    const debitosColaborador = debitos.filter(
      d => d.colaborador_id === colaboradorId
    );

    const totalComissoesServicos = comissoesServicosColaborador.reduce(
      (sum, c) => sum + c.valor_comissao, 0
    );
    const totalComissoesProdutos = comissoesProdutosColaborador.reduce(
      (sum, c) => sum + c.valor_comissao, 0
    );
    const totalComissoesIndicacoes = comissoesIndicacoesColaborador.reduce(
      (sum, c) => sum + c.valor_comissao, 0
    );
    const totalDebitos = debitosColaborador.reduce(
      (sum, d) => sum + d.valor, 0
    );

    const total = totalComissoesServicos + totalComissoesProdutos + totalComissoesIndicacoes - totalDebitos;

    return {
      colaborador_id: colaboradorId,
      colaborador_nome: '', // Será preenchido pelo serviço
      comissoes_servicos: totalComissoesServicos,
      comissoes_produtos: totalComissoesProdutos,
      comissoes_indicacoes: totalComissoesIndicacoes,
      debitos: totalDebitos,
      total: total,
    };
  }

  /**
   * Calcula projeção de comissões baseada no histórico
   */
  static calcularProjecaoComissoes(
    colaboradorId: number,
    resumoComissoes: ResumoComissoes,
    periodoDias: number = 30
  ): ProjecaoComissoes {
    const valorDiarioMedio = resumoComissoes.total / periodoDias;
    const projecaoSemanal = valorDiarioMedio * 7;
    const projecaoMensal = valorDiarioMedio * 30;

    return {
      colaborador_id: colaboradorId,
      colaborador_nome: resumoComissoes.colaborador_nome,
      projecao_semanal: projecaoSemanal,
      projecao_mensal: projecaoMensal,
    };
  }

  /**
   * Valida se um débito pode ser aplicado
   */
  static podeAplicarDebito(
    colaboradorId: number,
    valorDebito: number,
    resumoComissoes: ResumoComissoes
  ): boolean {
    return resumoComissoes.total >= valorDebito;
  }

  /**
   * Calcula comissão líquida após descontos
   */
  static calcularComissaoLiquida(
    comissaoBruta: number,
    debitos: number,
    impostos: number = 0
  ): number {
    return Math.max(0, comissaoBruta - debitos - impostos);
  }

  /**
   * Calcula meta de comissão baseada no desempenho
   */
  static calcularMetaComissao(
    colaboradorId: number,
    historicoComissoes: ResumoComissoes[],
    fatorCrescimento: number = 1.1
  ): number {
    if (historicoComissoes.length === 0) return 0;

    const ultimaComissao = historicoComissoes[historicoComissoes.length - 1];
    return ultimaComissao.total * fatorCrescimento;
  }

  /**
   * Verifica se colaborador atingiu meta de comissão
   */
  static atingiuMetaComissao(
    comissaoAtual: number,
    metaComissao: number
  ): boolean {
    return comissaoAtual >= metaComissao;
  }

  /**
   * Calcula percentual de atingimento da meta
   */
  static calcularPercentualAtingimento(
    comissaoAtual: number,
    metaComissao: number
  ): number {
    if (metaComissao === 0) return 0;
    return Math.min(100, (comissaoAtual / metaComissao) * 100);
  }
}
