// Importa o módulo 'http' do K6 para realizar requisições HTTP (GET, POST, etc.)
import http from 'k6/http';

// Importa a função 'check' do K6 para validar se a resposta da requisição atende critérios
import { check } from 'k6';

// Define as opções de execução do teste de carga
export const options = {
  vus: 10,             // Define 10 VUs (Virtual Users) que simularão usuários simultâneos
  duration: '10s',     // Os 10 VUs serão executados continuamente durante 10 segundos
};

// Função principal do teste — será executada por cada VU em loop durante a duração definida
//faz uma requisição HTTP do tipo GET para a URL https://test.k6.io — que é um ambiente de testes público mantido pela própria equipe do K6 — e valida se o status code da resposta é 200, que indica sucesso.
export default function () {
  // Realiza uma requisição HTTP GET para a URL de teste do K6
  const res = http.get('https://test.k6.io');

  // Valida se a resposta retornou com status 200 (OK)
  check(res, {
    // Nome do check: será mostrado nas métricas do teste
    'status é 200': (r) => r.status === 200,
    // A função compara o status da resposta com o valor 200 e retorna true/false
  });
}
