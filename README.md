ESTUDO TESTE DE PERFORMANCE COM K6

Teste de performance é dividido assim:

•	Teste de carga: avaliar o comportamento do sistema sob uma carga esperada. Ex: quando descobri o ponto de falha (com teste de stress), então realizo teste dentro de uma carga esperada sem provocar erros.

•	Teste de stress: identificar o ponto de falha do sistema, simulando condições extremas e além da capacidade máxima do sistema. Ex: estressar a aplicação até descobrir onde ela falha. Execute testes de estresse somente após executar testes de carga média. Identifique problemas de desempenho em testes de carga média antes de tentar algo mais desafiador. Esta sequência é essencial.

•	Teste de pico: avalia a resposta do sistema sob picos súbitos e inesperados de tráfego. Ex: promoção de vendas com grande quantidade de acessos de uma vez.

•	Teste de resiliência: testa a capacidade do sistema de manter um desempenho estável ao longo de um período prolongado.


Métricas de performance:

•	Tempo de resposta: medir o tempo que o sistema leva para processar uma requisição e responder ao usuário (idealmente deve ser inferior a 2 segundos)
•	Taxa de transferências
•	Uso de recursos do sistema (CPU, memória)
•	Erros e falhas (Ex: erro 500 ou 400 ou falhas de carregamento)
•	Troughput (requisições bem-sucedidas por minuto)
•	Conexões simultâneas
------------------------------------------------------------------------------------------------------------------------------------------


Projeto – 1ª etapa
Execução Local (via CLI)

1- Instalação do K6 CLI  (só pode ser via linha de comando: choco install k6).
2- Criação de uma estrutura de pastas no VS Code.
3- Criação de um script básico com auxílio do ChatGpt.
4- Execução via terminal com saída de dados básicos no próprio terminal e geração de result JSON para uso no relatório:  k6 run scripts/teste-basico.js --out json=results/result.json

CONCLUSÃO:
Seu notebook simula 10 usuários virtuais (VUs), que abrem conexões HTTP e fazem as requisições para o servidor na URL https://test.k6.io. O servidor só responde.
O resultado que o K6 gera no seu notebook reflete a performance da URL que você está testando, ou seja, o servidor remoto (https://test.k6.io).
Porém, o processamento dos 10 acessos simultâneos definidos no script de teste, ou seja, a simulação dos usuários realizando as requisições é todo realizado pelo seu notebook que executou o comando.
Desta forma, se seu notebook não conseguir acompanhar a carga configurada (exemplo: 10 VUs simultâneos ou mais), por limitações de CPU, memória ou rede e travar, o K6 não vai conseguir gerar o tráfego esperado de forma correta.
Para não sobrecarregar sua máquina local e ainda executar testes robustos com o K6, use:
•	Um ambiente dedicado para gerar carga
•	Servidor na nuvem (AWS, GCP, Azure, etc)
•	Configure uma VM com recursos adequados para rodar o K6 e gerar a carga.
•	Você roda o script remotamente e coleta os resultados sem consumir recursos do seu notebook.

Utilize o K6 Cloud (esta solução farei na etapa 3)
O K6 Cloud permite você subir o script e rodar testes distribuídos com alta escala, sem depender do seu computador. Você só precisa enviar o script e visualizar os resultados no painel web, e a geração da carga fica totalmente na infraestrutura deles.
------------------------------------------------------------------------------------------------------------------------------------------



Projeto – 2ª etapa
Converter os dados gerados em relatório HTML

1- Para gerar relatório HTML, foi necessário instalar Node.js: npm init -y
Depois instalar o k6-html-reporter: npm install --save-dev k6-html-reporter
k6 run --out json=results/result.json scripts/teste-basico.js
k6 convert results/result.json -O results.html

CONCLUSÃO: depois de inúmeras tentativas para tentar converter os dados JSON em relatório html, irei buscar outra opção.
Ao adicionar o import e a função handleSummary dentro do script de testes, foi possível gerar um relatório html.
Basta executar o comando básico: k6 run scripts/teste-basico.js

// Importa os geradores de relatório HTML e texto para o summary
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

// Gera o relatório HTML ao final do teste
export function handleSummary(data) {
  return {
    'summary.html': htmlReport(data), // Gera arquivo HTML
    stdout: textSummary(data, { indent: ' ', enableColors: true }), // Mostra resumo no terminal
  };
}

------------------------------------------------------------------------------------------------------------------------------------------



Projeto – 3ª etapa
Utilizar cloud para reproduzir os resultados

1- O que você precisa para usar o K6 Cloud (Grafana Cloud K6):
•	Conta gratuita ou paga no Grafana Cloud com o módulo de K6 ativado.
•	Script de teste local em JavaScript, com a extensão .js.
•	Instalação do K6 CLI localmente em sua máquina (vide etapa 1).
•	Autenticação via token de API da K6 Cloud.

2- Comando para realizar o login: k6 cloud login

Retorno no terminal:  Enter your token to authenticate with Grafana Cloud k6. Please, consult the Grafana Cloud k6 documentation for instructions on how to generate one: https://grafana.com/docs/grafana-cloud/testing/k6/author-run/tokens-and-cli-authentication

3- Acessar k6 Testing & synthetics / Performance / Settings – Stack token
Comando para realizar login com token:
k6 cloud login --token 8b098c7b1ffcf75867fd59d01f052ee3da683287cf1f0c924b27c4b62773c0f7
 


4- Comando para executar os testes no K6 Cloud
Bash:  k6 cloud scripts/teste-basico.js

O terminal mostra URL onde será executado os testes na nuvem exemplo: 
https://contatovinicius.grafana.net/a/k6-app/runs/4818175


CONCLUSÃO:
Com K6 Cloud você dispara o teste a partir do seu notebook, mas a execução real ocorre nos servidores da nuvem do K6, sem consumir quase nada dos recursos da sua máquina. Como isso funciona:
•	Seu notebook envia o script de teste para a plataforma K6 Cloud.
•	A execução acontece nos servidores deles, com infraestrutura escalável.
•	Você acompanha os resultados em tempo real pelo navegador (dashboard K6 Cloud).
•	Seu notebook não gera carga — ele só inicia o teste e exibe o progresso.
•	Não precisa manter seu notebook ligado depois de disparar o teste no K6 Cloud.
•	O seu notebook pode:
•	Ser desligado 📴
•	Perder conexão 🌐
•	Fechar o terminal 💻
→ e o teste continuará rodando normalmente e o resultado poderá ser visto depois.

------------------------------------------------------------------------------------------------------------------------------------------



Projeto – 4ª etapa
Integração com CI/CD

1- Criar um repositório remoto no GitHub, inicializar o git localmente e associar ao repositório remoto.
2- Salvar o token do K6 Cloud no GitHub Secrets and variables:
•	Vá em Settings > Secrets and variables > Actions > New repository secret
•	Nome: K6_CLOUD_TOKEN
•	Valor: seu token da Grafana K6 Cloud
3- Criar estrutura de pasta para GitHub Actions: .github/workflows/
4- Com auxílio do ChatGpt crie um arquivo básico para executar o workflow:  teste-k6.yml
•	O arquivo deve rodar a cada push
•	Deve ter opção de execução manual “workflow_dispatch”
•	Deve utilizar a variável secret do token

CONCLUSÃO:
Foi observado que mesmo executando o comando k6 cloud, o workflow permanece aguardando o final dos testes de performance, ou seja, o GitHub Actions vai ficar em execução (em progresso) enquanto o teste roda, mesmo sendo na nuvem. Se seu script simula milhares de usuários simultâneos e roda por vários minutos, a pipeline vai ficar aberta e ocupada durante todo esse período.
A pipeline não pode "apenas disparar" e terminar imediatamente — porque o comando k6 cloud é síncrono e espera o teste finalizar. Por padrão, o k6 cloud espera o teste terminar antes de encerrar.

💡 
Pesquisei por uma alternativa que disparasse a execução dos testes na cloud do K6 e encerrasse o workflow com sucesso antes do termino dos testes, capturando a URL para acompanhamento dos resultados dos testes de performance no Grafana.
Utilizei a flag --exit-on-running que permite iniciar a execução do script na nuvem e assim que gerar a URL encerrar o processo na máquina local sem esperar o término da execução no K6 Cloud.
✅Resultado:
•	A pipeline dispara o teste na nuvem 
•	Exibe a URL na interface do GitHub Actions
•	E encerra imediatamente com sucesso


Queria que abrisse uma janela com esta URL capturada como parte da execução da pipeline.
R: Mas o GitHub Actions não consegue abrir janelas ou navegar automaticamente para URLs no navegador do usuário. O GitHub Actions roda em servidores da GitHub, não na sua máquina. Ele não tem acesso ao seu navegador ou desktop local. Não há como "abrir uma aba" no seu navegador a partir de um script executado remotamente.

Sugestões extras
Você pode configurar:
•	Notificação no Slack ou Discord
•	E-mail automático com a URL
•	Mensagem no Telegram ou Teams

Caminho para executar manualmente:
1.	Acesse o seu repositório no GitHub depois na aba "Actions".
2.	Na lateral esquerda, clique no nome do seu workflow (por exemplo: Teste de Performance com K6 na Cloud).
3.	Clique no botão “Run workflow” para iniciar a execução (fica no lado direito da tela).

------------------------------------------------------------------------------------------------------------------------------------------


Projeto – 5ª etapa
Aplicação de cada tipo de teste de performance

1- Estudo de conceitos, comparativos, cenários e casos reais referentes a cada tipo de teste de performance.

O K6 por padrão só executa o que você manda, ou seja, ele não interpreta HTML nem executa JavaScript como um navegador real faria. Quando você manda http.get(‘https://www.google.com’) o K6 abre uma conexão com o servidor, baixa o HTML da página e fecha a conexão. Ele não carrega scripts, imagens ou estilos que o navegador normalmente carregaria depois.
Uma conexão ativa é quando um usuário interage com a página e outras requisições são realizadas como POST para enviar dados ou GET para carregar tabelas por exemplo. Algumas páginas carregam informações automaticamente como publicidades, bolsa valores etc sem interação do usuário. No K6, cada VU (usuário virtual) acessa a página, espera alguns segundos (sleep) e depois realiza novo acesso simulando uma interação com a página. O “sleep(5)”, por exemplo, seria o tempo que o usuário passa olhando a tela sem fazer nada por 5 segundos até voltar a interagir (fazer nova requisição como F5).
Acesso contínuo são usuários virtuais (VUs) executando requisições de forma constante e repetida durante todo o teste. É quando um usuário virtual (VU) faz uma requisição (ex: http.get()), espera um pequeno tempo (como sleep(1)), e repete esse ciclo sem parar, até o final do teste. Isso é considerado um cenário de acesso contínuo, pois os usuários não pausam por longos períodos, nem entram/saem do sistema. Por padrão, K6 usa conexões HTTP/1.1 com keep-alive habilitado, o que permite reusar a mesma conexão TCP para várias requisições seguidas — inclusive entre os ciclos com sleep(). Em acessos contínuos com sleep(), a conexão geralmente é mantida (keep-alive), não sendo reaberta a cada requisição, desde que o servidor permita. Isso torna o teste mais realista e eficiente. Se o sleep() for alto, a reutilização da conexão TCP/HTTP depende do tempo de inatividade aceito pelo servidor e do próprio K6, pode causar fechamento da conexão.


TIPOS DE TESTE DE PERFORMANCE

 

🧠 Resumo Comparativo
Tipo de Teste	Objetivo	Carga ao longo do tempo	Quando usar
Carga	Ver se o sistema suporta uso real	Carga constante	Uso normal ou pico médio previsto
Estresse	Encontrar o limite do sistema	Carga crescente até falhar	Saber até onde ele aguenta
Pico	Testar reação a acessos bruscos	Pico súbito e retorno	Eventos inesperados


1. Teste de Carga (Load Test)
Avalia o comportamento do sistema sob uso esperado ou ligeiramente acima do normal. Simula usuários reais por tempo contínuo.
Exemplo real:
Um e-commerce que geralmente tem cerca de 10 mil usuários simultâneos acessando durante o dia normal de vendas, e você quer garantir que o site aguente essa carga com boa resposta.

⚙️ Configuração típica:
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '1m',
};

export default function () {
  const res = http.get('https://example.com');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}

•	Os 50 usuários virtuais (VUs) permanecem ativos simultaneamente durante todo o tempo, executando requisições continuamente durante 1 minuto.
•	Cada VU faz 1 requisição por segundo → 50 × 60 = 3.000 requisições no total.
O sleep(1) faz com que cada VU:
•	Faça uma requisição
•	Espere 1 segundo
•	Repita o ciclo
•	A carga começa imediatamente com 50 VUs fixas (sem stages ou ramp-up).
•	Mantém uma carga constante e previsível — ideal para testes de carga estável.
•	Útil para observar consumo de recursos sob uso sustentado.
•	K6 inicia imediatamente com 50 VUs e mantém esse número constante durante os 2 minutos.
•	É uma carga estável desde o segundo 0 até o fim.
•	 Não há ramp-up (aumento gradual).
Aplicação típica:
Esse formato é mais usado para testes de páginas web ou sistemas onde o comportamento do usuário (espera entre ações) importa.

________________________________________
2. Teste de Estresse (Stress Test)
Verifica até onde o sistema aguenta carga crescente até começar a falhar (descobrir limite máximo).
Exemplo real:
Um sistema bancário onde você quer identificar quantas requisições simultâneas ele aguenta até que as respostas comecem a falhar ou atrasar demais.

⚙️ Configuração com ramp-up:
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },   // sobe até 50 VUs
    { duration: '30s', target: 100 },  // sobe até 100 VUs
    { duration: '30s', target: 200 },  // sobe até 200 VUs
    { duration: '30s', target: 0 },    // finaliza o teste
  ],
};

export default function () {
  const res = http.get('https://example.com');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
•	A carga aumenta gradualmente para descobrir o ponto de falha do sistema.
•	Serve para identificar gargalos, limites de CPU/memória, queda de performance.
Aplicação típica:
Também indicado para páginas web e aplicações front-end que precisam simular aumento gradual de usuários reais interagindo, com tempo de espera entre ações.


Explicando cada etapa
1. { duration: '30s', target: 50 }
•	O K6 irá aumentar gradualmente de 0 até 50 VUs ao longo de 30 segundos.
•	Ou seja, nem todos os 50 VUs estarão ativos durante os 30s inteiros.
•	Resultado: menor que 50×30/1 = 1500 requisições serão feitas, pois os VUs vão surgindo aos poucos.

2. { duration: '30s', target: 100 }
•	Aumenta de 50 até 100 VUs durante 30 segundos.
•	Aqui sim, os 50 primeiros VUs já estão ativos no início dessa etapa.
•	Mas, como os demais VUs (até 100) entram gradualmente, você não terá 100 VUs durante todos os 30 segundos.
•	Resultado: menos que 100×30 = 3000 requisições.

3. { duration: '30s', target: 0 }
•	O K6 reduz gradualmente de 200 para 0 VUs.
•	Isso não significa 0 requisições durante os 30s, mas sim uma diminuição progressiva até parar completamente.
•	Resultado: VUs ainda fazem requisições no início, que vão diminuindo até zerar ao final dos 30s.

________________________________________
3. Teste de Pico (Spike Test)
Avalia como o sistema reage a um aumento repentino (pico) de usuários.
Exemplo real:
Um site de ingressos para shows que abre venda em horário marcado e espera uma súbita alta no acesso no momento da liberação.

⚙️ Configuração:
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },   // começa com 10 usuários
    { duration: '5s', target: 200 },   // pico repentino para 200
    { duration: '10s', target: 10 },   // volta para 10
    { duration: '10s', target: 0 },    // encerra
  ],
};

export default function () {
  const res = http.get('https://example.com');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
•	O sistema sofre um pico súbito de carga (ex: promoção, evento ao vivo).
•	Verificamos se ele responde, mantém estabilidade e se recupera após o pico.
________________________________________


Tempo que devo considerar em cada teste:

Carga: entre 5 e 60 minutos costuma ser suficiente para simular um cenário de uso contínuo e medir estabilidade, uso de recursos (CPU, RAM), e throughput.

Stress: de 5 a 60 minutos é o mais comum. Aqui o foco é intensidade, não duração. Você aumenta a carga além do esperado rapidamente. Começa com 100 usuários, sobe para 200, depois 500, até o sistema falhar.

Pico: bem curta, geralmente segundos ou poucos minutos.

________________________________________

Métrica (Usuários VU x Requisições RPS)  que devo considerar em cada teste:

Em testes de carga, o que é mais relevante: número de requisições ou de usuários?
🎯 Depende do seu objetivo, mas na maioria dos casos: número de usuários
Porque:
•	O comportamento do sistema na vida real depende de usuários simultâneos (concorrência), não apenas da quantidade bruta de requisições.
•	Exemplo:
10.000 requisições feitas por 10 usuários ao longo de horas ≠ 10.000 requisições feitas por 1.000 usuários ao mesmo tempo em 1 minuto.
Usuários simultâneos afetam:
•	Concorrência no banco de dados
•	Sessões abertas
•	Locks e filas
•	Threads do servidor
•	Escalabilidade
________________________________________
🔸 quando considerar requisições por segundo (RPS)?
Quando o foco for capacidade de throughput:
•	Ex: sistemas de APIs que precisam aguentar X requisições/segundo.
Muito útil em:
•	Gateways
•	APIs REST
•	Microserviços
•	Load Balancers


 



🛒 1. Simulação de site em Black Friday (usuários simultâneos - VUs)
•	Simula crescimento orgânico de tráfego
•	Reproduz o comportamento humano real
•	Ideal para testar frontend e backend juntos (ex: navegação, sessões, banco de dados)

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 0 },     // inicia sem usuários
    { duration: '2m', target: 500 },   // sobe gradualmente até 500 usuários
    { duration: '3m', target: 500 },   // mantém 500 usuários ativos
    { duration: '1m', target: 0 },     // finaliza reduzindo os acessos
  ],
};

export default function () {
  const res = http.get('https://example.com');  // simula o carregamento da home ou página

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);  // simula leitura/navegação
}
________________________________________
🔗 2. Teste de API REST com foco em throughput (requisições por segundo - RPS)
•	Mantém a taxa de requisições estável, independentemente da quantidade de VUs
Ideal para:
•	Testar resiliência e escalabilidade da API
•	Descobrir o limite de RPS suportado
•	Avaliar latência, throughput e erros (HTTP 500, 429, etc.)


import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    api_rps_test: {
      executor: 'constant-arrival-rate',
      rate: 1000,              // 1000 requisições por segundo
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 200,    // VUs reservados para dar conta do volume
      maxVUs: 1000,            // limite superior de VUs se necessário
    },
  },
};

export default function () {
  const res = http.get('https://api.example.com/v1/products');  // simula chamada a um endpoint REST

  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}
------------------------------------------------------------------------------------------------------------------------------------------



Projeto – 6ª etapa
Realizando testes em ambientes corporativos

1- Quando você executa um teste no k6 Cloud, os usuários virtuais (VUs) são simulados diretamente na infraestrutura em nuvem da Grafana Labs (k6), e não no seu notebook. Isso significa que o desempenho do seu computador não afeta o teste, já que toda a carga é gerada pelos servidores do k6 Cloud.
Ao executar um teste no K6 Cloud:
Os usuários virtuais (VUs) são gerados em servidores da infraestrutura do K6 (baseados na nuvem).
Seu notebook apenas envia o script e inicia o teste, mas não é responsável pela execução das requisições de carga.
Isso significa que não consome CPU, memória ou largura de banda da sua máquina local durante o teste.

2- Se a URL ou API que você está testando estiver em um ambiente interno da sua empresa (não acessível publicamente na internet), o k6 Cloud não conseguirá acessá-la diretamente

1. Usando o k6 Agent
O k6 Agent é um componente leve que você instala dentro da sua rede interna (ex.: em um servidor, VM ou até mesmo no seu notebook).
Ele age como um proxy reverso, permitindo que os testes executados no k6 Cloud se comuniquem com sistemas internos.
Como funciona?
O k6 Cloud envia as requisições para o Agent, que está dentro da sua rede.
O Agent redireciona essas requisições para o sistema interno.
As respostas são enviadas de volta ao k6 Cloud via Agent.

2. Expondo temporariamente o endpoint interno via VPN/SSH Tunnel
Se sua empresa tem uma VPN ou permite túneis SSH, você pode configurar um acesso temporário para o k6 Cloud.

3. Usando um IP público temporário (não recomendado para ambientes seguros)
Riscos: Isso pode trazer vulnerabilidades de segurança, então só deve ser feito em ambientes controlados.


Recomendação:
Para testes em APIs/sites internos, o k6 Agent é a solução mais segura e recomendada.



O k6 Agent pode ser instalado e executado em um pipeline CI/CD (como GitHub Actions, GitLab CI, Jenkins, etc.), permitindo que testes de carga no k6 Cloud acessem sistemas internos durante a execução automatizada.

Exemplo Prático (GitHub Actions)
Aqui está um exemplo de como configurar o k6 Agent em um pipeline do GitHub Actions:
1. Workflow YAML (k6-load-test.yml)

name: k6 Load Test with Agent  
on: [push]  

jobs:  
  k6-load-test:  
    runs-on: ubuntu-latest  # Ou um self-hosted runner dentro da sua rede  
    steps:  
      - name: Checkout  
        uses: actions/checkout@v4  

      - name: Install k6 Agent  
        run: |  
          curl -L https://github.com/grafana/k6/releases/download/v0.47.0/k6-agent-linux-amd64.tar.gz | tar xz  
          chmod +x k6-agent  

      - name: Start k6 Agent (em background)  
        run: |  
          ./k6-agent --cloud-token ${{ secrets.K6_CLOUD_TOKEN }} &  
          sleep 5  # Aguarda o Agent inicializar  

      - name: Run k6 Cloud Test  
        run: |  
          k6 cloud --token ${{ secrets.K6_CLOUD_TOKEN }} script.js  

      - name: Stop k6 Agent  
        run: pkill k6-agent  # Encerra o Agent após o teste  




Para iniciar testes com K6 em ambiente corporativo devemos considerar instalação em máquina local ou servidor da empresa?

1. Instalar em sua máquina local (dev/QA)
Prós:
Ideal para desenvolvimento dos scripts de testes antes de escalar.
Controle total: Facilidade de configuração e execução sem burocracia corporativa.
Ambiente isolado: Não impacta a infraestrutura da empresa.
Simulações rápidas de carga com poucos usuários virtuais VUs (em APIs internas ou ambientes de homologação)
Validação de performance durante o desenvolvimento (ex: via VS Code + terminal)

Contras:
Recursos limitados: Sua máquina pode não ter capacidade para simular carga alta (ex: milhares de usuários virtuais).
Dependência da sua conexão: A rede local pode distorcer resultados (latência, banda).
Problemas de compliance: Dados sensíveis podem não poder ser testados localmente.


2. Instalar em um servidor corporativo
Prós:
Capacidade de carga maior: Servidores geralmente têm mais CPU, RAM e rede estável.
Ambiente controlado: Mais próximo do cenário real de produção (ex: mesma rede/VPC).
Integração com CI/CD: Facilita testes automatizados em pipelines (ex: Jenkins, GitLab CI).
Conformidade com políticas: Atende a requisitos de segurança e governança.
Instalação em um servidor (máquina dedicada ou cloud)

Contras:
Burocracia: Pode exigir aprovações de TI/Segurança para instalar ferramentas.
Configuração complexa: Proxy, firewalls ou restrições de saída podem exigir ajustes.


Exemplo de Fluxo Corporativo:
1. Desenvolver script no seu PC → `k6 run script.js` (testes pequenos).
2. Subir para um repositório Git (ex: GitHub/GitLab da empresa).
3. Executar em um servidor de CI/CD ou container com: k6 run scripts/teste-basico.js

Comando para executar os testes no K6 Cloud: k6 cloud scripts/teste-basico.js

------------------------------------------------------------------------------------------------------------------------------------------



Projeto – 7ª etapa
Criar teste de carga em API

1- Iniciar o teste com um endpoint isolado e depois evoluir para um fluxo
2- Testar APIs integradas . Testar uma ou várias APIs que interagem com outras APIs internas ou externas. Seu foco pode ser testar um sistema ou vários.
3- Testando fluxos de API de ponta a ponta . Simulando interações realistas entre APIs para testar o sistema como um todo

Analisando exemplo básico:
import http from 'k6/http';

export const options = {
  vus: 50,
  duration: '30s',
};

export default function () {
  const payload = JSON.stringify({
    name: 'lorem',
    surname: 'ipsum',
  });
  const headers = { 'Content-Type': 'application/json' };
  http.post('https://quickpizza.grafana.com/api/post', payload, { headers });
}

Os 50 usuários virtuais (VUs) são executados juntos ou gradualmente?
export const options = {
  vus: 50,
  duration: '30s',
};
Os 50 usuários virtuais são iniciados imediatamente, ou seja, todos começam ao mesmo tempo, mantendo esse número constante durante os 30 segundos.
Não há ramp-up (aumento gradual de usuários) — esse comportamento só aconteceria se você usasse stages (como no teste de stress ou soak).


O que significa "executam continuamente por 30 segundos"?
Significa que cada VU executa o default function() em loop durante 30 segundos.
Como não há sleep() no código, assim que uma requisição termina, o VU faz outra imediatamente.
Ou seja:
Cada VU envia o máximo de requisições POST que conseguir no tempo disponível (em 30 segundos), uma após a outra, sem pausa.


Serão exatamente 50 × 30 = 1.500 requisições?
Não exatamente.
Esse cálculo só seria válido se cada VU fizesse 1 requisição por segundo, o que não acontece aqui, pois:
•	Cada VU faz múltiplas requisições por segundo, dependendo da velocidade da resposta da API.
•	Então, no total, o número de requisições tende a ser muito maior do que 1.500.
Exemplo realista:
Suponha que a requisição POST leve 200ms (0,2s) para ser respondida.
•	Cada VU consegue fazer 5 requisições por segundo (1 ÷ 0,2 = 5).
•	Então:
50 VUs × 5 req/s × 30 s = 7.500 requisições no total.
Se a API for muito rápida, o número pode ser ainda maior.


Dica:
Se quiser controlar a frequência, você pode usar sleep(1) dentro da função:
export default function () {
  http.post(...);
  sleep(1); // pausa de 1 segundo entre requisições
}
Aí sim cada VU faria 1 requisição por segundo, e o cálculo 50 × 30 = 1.500 se tornaria válido.






------------------------------------------------------------------------------------------------------------------------------------------



Projeto – xª etapa
Análise dos resultados

1- Analisar o resultado dos testes acessando Grafana K6 Testing & synthetics > Performance > Projects > Clica no nome do projeto > será exibido um gráfico de colunas, basta clicar em qualquer coluna para analisar os dados.

Principais Métricas no Grafana k6 Cloud
1. Requests per second (RPS)
•	O que é: Quantas requisições foram feitas por segundo.
•	O que analisar: Está de acordo com o esperado? (Ex: 10 VUs com http.get() contínuo + sem sleep = alto RPS, geralmente 100+ RPS).
•	Alvo: Estabilidade e crescimento controlado, sem quedas ou picos inexplicáveis.
2. HTTP Req Duration (latência de resposta)
•	O que é: Tempo total que uma requisição leva do envio à resposta.
•	Indicadores chave:
o	p(90) → 90% das requisições foram mais rápidas que este tempo.
o	p(95) e p(99) → ajudam a ver outliers (requisições lentas).
•	Alvo: Consistência e valores abaixo de 300ms para bons sistemas (varia por caso).
3. Checks
•	O que é: Validação do status 200 que você escreveu no check.
•	O que analisar: Se 100% passaram, ótimo. Se houver falhas, algo na aplicação não está respondendo corretamente.
4. Errors
•	O que é: Quaisquer erros de conexão, timeout, falhas no check etc.
•	O que analisar: Ideal é 0 erros. Se houver, verificar código, instabilidade no endpoint, ou problema de rede.
5. VU metrics
•	Executions per second: Mede a frequência com que cada VU consegue executar a default function.
•	Se os VUs estiverem sobrecarregados ou lentos, você verá isso aqui.
________________________________________
💡 Interpretação de Exemplo com seu código:
•	Expected RPS: Cerca de 80–120 requests/s com 10 VUs por 10s (varia conforme o tempo de resposta do servidor).
•	Check success rate: 100% se https://test.k6.io respondeu com status 200 sempre.
•	p(95) Req Duration: Idealmente < 300ms. Se estiver > 1s, indica lentidão no servidor.
________________________________________
📊 Extras úteis no painel:
•	Trends over time: Veja se há aumento de latência ou erros ao longo dos 10s.
•	VU Load Distribution: Se quiser ver se todos os VUs estão contribuindo igualmente.
 


 




Projeto – Xª etapa
Usando gravador no navegador

1- O gravador de navegador permite gerar um script k6 com base em uma sessão do navegador. Está disponível como uma extensão para Chrome e Firefox .




