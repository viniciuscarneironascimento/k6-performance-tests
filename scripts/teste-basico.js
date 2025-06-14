// Importa o módulo 'http' do K6 para realizar requisições HTTP (GET, POST, etc.)
import http from 'k6/http';

// Importa a função 'check' do K6 para validar se a resposta da requisição atende critérios
import { check } from 'k6';

// Importa os geradores de relatório HTML e texto para o summary
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

// Define as opções de execução do teste de carga
export const options = {
  vus: 10,             // Define 10 VUs (Virtual Users) que simularão usuários simultâneos
  duration: '10s',     // Os 10 VUs serão executados continuamente durante 10 segundos
};

// Função principal do teste — será executada por cada VU em loop durante a duração definida
export default function () {
  // Realiza uma requisição HTTP GET para a URL de teste do K6
  const res = http.get('https://test.k6.io');

  // Valida se a resposta retornou com status 200 (OK)
  check(res, {
    'status é 200': (r) => r.status === 200,
  });
}

// Gera o relatório HTML ao final do teste
export function handleSummary(data) {
  return {
    'summary.html': htmlReport(data), // Gera arquivo HTML
    stdout: textSummary(data, { indent: ' ', enableColors: true }), // Mostra resumo no terminal
  };
}
