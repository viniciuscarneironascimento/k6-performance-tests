import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },    // carga inicial baixa
    { duration: '10s', target: 500 },   // pico repentino para 500 VUs
    { duration: '10s', target: 10 },    // volta para carga baixa
    { duration: '10s', target: 0 },     // encerra
  ],
};

export default function () {
  const res = http.get('https://api.example.com/v1/data');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}

//Descrição: simula um pico rápido, como uma campanha ou lançamento, para avaliar se a API suporta o aumento repentino de tráfego.