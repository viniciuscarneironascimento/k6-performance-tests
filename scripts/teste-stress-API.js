import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },   // começa com 100 VUs
    { duration: '2m', target: 500 },   // aumenta para 500 VUs
    { duration: '2m', target: 1000 },  // sobe para 1000 VUs
    { duration: '2m', target: 2000 },  // sobe para 2000 VUs (limite a testar)
    { duration: '2m', target: 0 },     // desliga gradual
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% das requisições em menos de 500ms
    http_req_failed: ['rate<0.01'],   // menos de 1% de falhas
  },
};

export default function () {
  const res = http.get('https://api.example.com/v1/data');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}

//Descrição: simula aumento progressivo da carga para encontrar o ponto de falha ou degradação do sistema.