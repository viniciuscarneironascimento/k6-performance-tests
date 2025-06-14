//Avalia como o sistema reage a um aumento repentino (pico) de usuários.

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

//Pico: bem curta, geralmente segundos ou poucos minutos.
/*
Características principais:
Aumento súbito e agressivo de usuários:
De 10 VUs para 200 VUs em apenas 5 segundos → simula um pico de tráfego inesperado.
Depois, a carga cai rapidamente de volta para 10 e então é finalizada.
Esse comportamento é típico de situações como:
Uma promoção relâmpago.
Uma campanha publicitária viral.
Um acesso em massa após o início de um evento.
*/