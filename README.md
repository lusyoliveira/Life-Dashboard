## Life Dashboard
- Este projeto tem prósito de centralizar a organização de várias aréas da vida.

## Deploy
- Indisponível

## Stack utilizada
- ✅[Bootstrap CSS](https://getbootstrap.com/)
- ✅[Plugin dataTables](https://datatables.net/)
- ✅[Biblioteca Charts.js](https://www.chartjs.org/docs/latest/getting-started/)
- ✅[API de previsão do tempo Open-Meteo](https://open-meteo.com/)
- ✅[API TMDB](https://api.themoviedb.org/)
- ❌API do MyAnimelist

## Funcionalidades
### ✅ Agenda de Compromissos
- Permite adicionar, editar ou excluir compromissos em uma agenda, definido data/hora, descrição e tipo de compromisso.
- No página da agenda é possível visualizar os próximos compromissos, assim como um gráfico dos compromissos por tipo. 
- Permite adicionar, editar ou excluir categorias, tipos e status da agenda.
- Visualização de calendário na dashboard inicial.
- Compromissos com recorrência são automaticamente atualizados para o próximo mês ou ano (em construção).
- Permite associar contatos ao comprimisso (Não Iniciado).
### ❌ Contatos (MÃO INICIADO)
- Permite adicionar, editar ou excluir um contato.
- Permite vincular o contato num compromisso da agenda.
### ✅ Controle de Tarefas
- Permite adicionar, editar ou excluir uma tarefa.
- Permitir marcar tarefa como feita.
- Visualização de tarefas na dashboard inicial.
### ✅ Controle Financeiro
- Permite adicionar, editar ou excluir uma transação financeira.
- Permite adicionar, editar ou excluir uma conta.
- Permite adicionar, editar ou excluir categorias, tipos da transação.
- Transações com recorrência são automaticamente atualizados para o próximo mês ou ano.
- Saldo da conta é atualizado automaticamente ao inserir uma transação positiva ou negativa.
- Visualização do resumo do saldo das contas e gráfico por categoria no dashboard financeiro.
### ✅ Controle de Filmes, Séries, Animes
- Permite adicionar, editar ou excluir um título sendo filme, série, documentário, shows, reallity ou desenho.
- Permite adicionar, editar ou excluir status, tipos e plataforma do título.
- Permite puxar dados do título via integração do TMDB (em construção).
- Exibe gráfico e estatísticas no dashboard de catalogo.
- Exibe titulo que estão sendo assistidos atualmente no dashboard inicial.
### ✅ Previsão do Tempo
- Exibe a previsão do tempo dos último 7 dias no dashboard inicial.
- Atualiza previsão do tempo automaticamente conforme definido nas configurações do sistema.
### ✅ Contador de água
- Permite contar quanto copos de água bebeu no dia atual.
### ✅ Contagem Regressiva Personalizável
- Permite definir apenas uma contagem regressiva definindo data e descrição.
### ❌ Diário
### ❌ Controle de Hábitos

## Rodando localmente
Clone o projeto e entre no diretório

`git clone <link_do_projeto>`
`cd life-dashboard`

### Instale as dependências
 `npm install`
