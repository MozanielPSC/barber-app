import { EstoqueProduto, MovimentacaoEstoque, ProdutoEstoqueBaixo } from '../types';

export class EstoqueBusinessRules {
  /**
   * Verifica se um produto está com estoque baixo
   */
  static isEstoqueBaixo(estoqueProduto: EstoqueProduto): boolean {
    return estoqueProduto.quantidade <= estoqueProduto.quantidade_minima;
  }

  /**
   * Calcula valor total do estoque
   */
  static calcularValorTotalEstoque(
    produtosEstoque: EstoqueProduto[],
    precosProdutos: Map<number, number>
  ): number {
    return produtosEstoque.reduce((total, produto) => {
      const preco = precosProdutos.get(produto.produto_id) || 0;
      return total + (produto.quantidade * preco);
    }, 0);
  }

  /**
   * Calcula produtos com estoque baixo
   */
  static calcularProdutosEstoqueBaixo(
    produtosEstoque: EstoqueProduto[]
  ): ProdutoEstoqueBaixo[] {
    return produtosEstoque
      .filter(produto => this.isEstoqueBaixo(produto))
      .map(produto => ({
        produto_id: produto.produto_id,
        produto_nome: produto.produto.nome,
        quantidade_atual: produto.quantidade,
        quantidade_minima: produto.quantidade_minima,
        prateleira_nome: produto.prateleira.nome,
      }));
  }

  /**
   * Valida se uma movimentação de saída pode ser realizada
   */
  static podeRealizarSaida(
    produtoId: number,
    quantidade: number,
    produtosEstoque: EstoqueProduto[]
  ): boolean {
    const produto = produtosEstoque.find(p => p.produto_id === produtoId);
    if (!produto) return false;

    return produto.quantidade >= quantidade;
  }

  /**
   * Calcula quantidade sugerida para reposição
   */
  static calcularQuantidadeReposicao(
    produtoEstoque: EstoqueProduto,
    diasConsumoMedio: number = 30,
    margemSeguranca: number = 1.2
  ): number {
    const consumoMedioDiario = produtoEstoque.quantidade_minima / diasConsumoMedio;
    const quantidadeSugerida = Math.ceil(consumoMedioDiario * diasConsumoMedio * margemSeguranca);
    
    return Math.max(quantidadeSugerida, produtoEstoque.quantidade_minima * 2);
  }

  /**
   * Calcula giro de estoque
   */
  static calcularGiroEstoque(
    produtoId: number,
    movimentacoes: MovimentacaoEstoque[],
    periodoDias: number = 30
  ): number {
    const movimentacoesProduto = movimentacoes.filter(
      m => m.produto_id === produtoId && 
      new Date(m.data) >= new Date(Date.now() - periodoDias * 24 * 60 * 60 * 1000)
    );

    const totalSaidas = movimentacoesProduto
      .filter(m => m.tipo === 'saida')
      .reduce((sum, m) => sum + m.quantidade, 0);

    return totalSaidas;
  }

  /**
   * Calcula tempo de reposição baseado no giro
   */
  static calcularTempoReposicao(
    produtoId: number,
    movimentacoes: MovimentacaoEstoque[],
    estoqueAtual: number
  ): number {
    const giroMensal = this.calcularGiroEstoque(produtoId, movimentacoes, 30);
    
    if (giroMensal === 0) return 999; // Produto sem movimento
    
    const diasRestantes = (estoqueAtual / giroMensal) * 30;
    return Math.ceil(diasRestantes);
  }

  /**
   * Valida se uma movimentação de ajuste é necessária
   */
  static precisaAjusteEstoque(
    produtoEstoque: EstoqueProduto,
    diferencaInventario: number,
    toleranciaPercentual: number = 5
  ): boolean {
    const toleranciaAbsoluta = produtoEstoque.quantidade * (toleranciaPercentual / 100);
    return Math.abs(diferencaInventario) > toleranciaAbsoluta;
  }

  /**
   * Calcula custo médio ponderado
   */
  static calcularCustoMedioPonderado(
    produtoId: number,
    movimentacoes: MovimentacaoEstoque[]
  ): number {
    const movimentacoesProduto = movimentacoes
      .filter(m => m.produto_id === produtoId && m.tipo === 'entrada')
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

    let saldoQuantidade = 0;
    let saldoValor = 0;

    for (const movimentacao of movimentacoesProduto) {
      // Assumindo que o valor está em uma propriedade não definida no tipo
      // Em uma implementação real, você adicionaria essa propriedade
      const valorUnitario = 0; // Placeholder
      const valorTotal = movimentacao.quantidade * valorUnitario;

      saldoQuantidade += movimentacao.quantidade;
      saldoValor += valorTotal;
    }

    return saldoQuantidade > 0 ? saldoValor / saldoQuantidade : 0;
  }

  /**
   * Calcula indicadores de performance do estoque
   */
  static calcularIndicadoresEstoque(
    produtosEstoque: EstoqueProduto[],
    movimentacoes: MovimentacaoEstoque[]
  ) {
    const produtosComEstoqueBaixo = this.calcularProdutosEstoqueBaixo(produtosEstoque);
    const valorTotalEstoque = this.calcularValorTotalEstoque(produtosEstoque, new Map());
    
    const produtosSemMovimento = produtosEstoque.filter(produto => {
      const movimentacoesProduto = movimentacoes.filter(
        m => m.produto_id === produto.produto_id &&
        new Date(m.data) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
      return movimentacoesProduto.length === 0;
    });

    return {
      totalProdutos: produtosEstoque.length,
      produtosEstoqueBaixo: produtosComEstoqueBaixo.length,
      produtosSemMovimento: produtosSemMovimento.length,
      valorTotalEstoque,
      percentualEstoqueBaixo: (produtosComEstoqueBaixo.length / produtosEstoque.length) * 100,
    };
  }
}
