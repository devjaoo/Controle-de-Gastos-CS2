let saldoTotal = 0;
let apostas = JSON.parse(localStorage.getItem('apostas')) || [];

// Carregar apostas salvas ao carregar a página
function carregarApostas() {
    const tabela = document.getElementById('tabela-apostas').getElementsByTagName('tbody')[0];
    tabela.innerHTML = ''; // Limpa a tabela antes de preencher novamente
    apostas.forEach((aposta, index) => {
        const novaLinha = tabela.insertRow();
        novaLinha.innerHTML = `
            <td>${aposta.data}</td>
            <td>R$ ${aposta.entrada.toFixed(2)}</td>
            <td>R$ ${aposta.saida.toFixed(2)}</td>
            <td class="${aposta.lucroPrejuizo > 0 ? 'positivo' : 'negativo'}">${aposta.resultado}</td>
            <td class="${aposta.lucroPrejuizo > 0 ? 'positivo' : 'negativo'}">R$ ${aposta.lucroPrejuizo.toFixed(2)}</td>
            <td class="button-container">
                <button onclick="removerAposta(${index})">Remover</button>
            </td>
        `;
    });

    // Atualiza o saldo total
    saldoTotal = apostas.reduce((acc, aposta) => acc + aposta.lucroPrejuizo, 0);
    document.getElementById('saldo-total').innerText = saldoTotal.toFixed(2);
}

// Adicionar nova aposta
function adicionarAposta() {
    const data = document.getElementById('data').value;
    const entrada = parseFloat(document.getElementById('entrada').value);
    const saida = parseFloat(document.getElementById('saida').value);

    if (!data || isNaN(entrada) || isNaN(saida)) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    let lucroPrejuizo = saida - entrada;
    let resultado = lucroPrejuizo > 0 ? 'Ganhou' : 'Perdeu';

    // Salvar a nova aposta
    apostas.push({
        data: data,
        entrada: entrada,
        saida: saida,
        lucroPrejuizo: lucroPrejuizo,
        resultado: resultado
    });

    // Atualiza o saldo total
    saldoTotal += lucroPrejuizo;

    // Atualiza a tabela
    const tabela = document.getElementById('tabela-apostas').getElementsByTagName('tbody')[0];
    const novaLinha = tabela.insertRow();
    novaLinha.innerHTML = `
        <td>${data}</td>
        <td>R$ ${entrada.toFixed(2)}</td>
        <td>R$ ${saida.toFixed(2)}</td>
        <td class="${lucroPrejuizo > 0 ? 'positivo' : 'negativo'}">${resultado}</td>
        <td class="${lucroPrejuizo > 0 ? 'positivo' : 'negativo'}">R$ ${lucroPrejuizo.toFixed(2)}</td>
        <td class="button-container">
            <button onclick="removerAposta(${apostas.length - 1})">Remover</button>
        </td>
    `;

    // Atualiza o saldo total na interface
    document.getElementById('saldo-total').innerText = saldoTotal.toFixed(2);

    // Salva os dados no localStorage
    localStorage.setItem('apostas', JSON.stringify(apostas));

    // Limpa os campos
    document.getElementById('data').value = '';
    document.getElementById('entrada').value = '';
    document.getElementById('saida').value = '';
}

// Remover aposta
function removerAposta(index) {
    // Remove a aposta do array
    apostas.splice(index, 1);

    // Atualiza o saldo total
    saldoTotal = apostas.reduce((acc, aposta) => acc + aposta.lucroPrejuizo, 0);
    document.getElementById('saldo-total').innerText = saldoTotal.toFixed(2);

    // Atualiza o localStorage
    localStorage.setItem('apostas', JSON.stringify(apostas));

    // Recarrega a tabela
    carregarApostas();
}

// Exportar para CSV
function exportarCSV() {
    const linhas = [];
    linhas.push(['Data', 'Entrada (R$)', 'Saída (R$)', 'Resultado', 'Lucro/Prejuízo']); // Cabeçalho

    apostas.forEach(aposta => {
        linhas.push([
            aposta.data,
            aposta.entrada.toFixed(2),
            aposta.saida.toFixed(2),
            aposta.resultado,
            aposta.lucroPrejuizo.toFixed(2)
        ]);
    });

    // Criar conteúdo CSV
    const csvContent = linhas.map(e => e.join(',')).join('\n');

    // Criar o link para download
    const link = document.createElement('a');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    link.setAttribute('download', 'apostas.csv');
    link.click();
}

// Carregar apostas quando a página for carregada
window.onload = carregarApostas;
