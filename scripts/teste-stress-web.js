//Verifica até onde o sistema aguenta carga crescente até começar a falhar (descobrir limite máximo).

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

//Stress: de 10 a 30 minutos é o mais comum. Aqui o foco é intensidade, não duração. Você aumenta a carga além do esperado rapidamente. Começa com 100 usuários, sobe para 200, depois 500, até o sistema falhar.
/*
Características do código:
Utiliza stages com aumento progressivo da carga:
50 VUs → 100 VUs → 200 VUs
Cada estágio dura 30 segundos, simulando uma escalada de usuários em um curto período.
O objetivo é avaliar até onde o sistema aguenta sem falhar ou degradar o desempenho.

Aplicação típica:
Também indicado para páginas web e aplicações front-end que precisam simular aumento gradual de usuários reais interagindo, com tempo de espera entre ações.
*/