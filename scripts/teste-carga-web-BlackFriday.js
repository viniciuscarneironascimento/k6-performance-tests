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

/*
Simulação de site em Black Friday (usuários simultâneos - VUs)
Simula crescimento orgânico de tráfego
Reproduz o comportamento humano real
Ideal para testar frontend e backend juntos (ex: navegação, sessões, banco de dados)

Aplicação típica:
Pode ser usado para páginas web, mas também para sistemas em geral que precisam de teste de carga sustentada.
*/