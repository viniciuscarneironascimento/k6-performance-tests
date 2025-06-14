//Avalia o comportamento do sistema sob uso esperado ou ligeiramente acima do normal. Simula usuários reais por tempo contínuo.

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

//Carga: entre 10 e 60 minutos costuma ser suficiente para simular um cenário de uso contínuo e medir estabilidade, uso de recursos (CPU, RAM), e throughput.

//Por que é um teste de carga?
/*
Características do código:
vus: 50 → 50 usuários virtuais simultâneos, simulando uso constante.
duration: '1m' → durante 1 minuto contínuo, sem variação na carga.
sleep(1) → cada VU faz 1 requisição por segundo, em média.
check(status 200) → garante que as respostas sejam válidas.

Aplicação típica:
Esse formato é mais usado para testes de páginas web ou sistemas onde o comportamento do usuário (espera entre ações) importa.
*/
