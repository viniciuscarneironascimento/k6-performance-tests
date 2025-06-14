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

/*
Mantém a taxa de requisições estável, independentemente da quantidade de VUs
Ideal para:
Testar resiliência e escalabilidade da API
Descobrir o limite de RPS suportado
Avaliar latência, throughput e erros (HTTP 500, 429, etc.)
*/