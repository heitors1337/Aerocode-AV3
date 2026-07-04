import axios from 'axios';

const API_URL = 'http://localhost:3001/api/aeronaves'; // Endpoint to test

async function simulateUser() {
  const start = performance.now();
  const res = await axios.get(API_URL);
  const end = performance.now();

  const responseTime = end - start;
  const processingTime = parseFloat(res.headers['x-processing-time'] || '0');
  const latency = Math.max(0, responseTime - processingTime); // Network + Node Event Loop latency

  return { responseTime, processingTime, latency };
}

async function runTest(numUsers: number) {
  console.log(`\n--- Teste com ${numUsers} usuário(s) simultâneo(s) ---`);
  
  const promises = [];
  for (let i = 0; i < numUsers; i++) {
    promises.push(simulateUser());
  }

  const results = await Promise.all(promises);

  const avgResponseTime = results.reduce((acc, r) => acc + r.responseTime, 0) / numUsers;
  const avgProcessingTime = results.reduce((acc, r) => acc + r.processingTime, 0) / numUsers;
  const avgLatency = results.reduce((acc, r) => acc + r.latency, 0) / numUsers;

  console.log(`Latência Média: ${avgLatency.toFixed(2)} ms`);
  console.log(`Tempo de Processamento Médio: ${avgProcessingTime.toFixed(2)} ms`);
  console.log(`Tempo de Resposta Médio: ${avgResponseTime.toFixed(2)} ms`);
  
  return { numUsers, avgLatency, avgProcessingTime, avgResponseTime };
}

async function main() {
  // Warming up the server to avoid cold start overhead
  try {
    await axios.get(API_URL);
  } catch(e) {
    console.error("Erro ao conectar no servidor. Certifique-se de que ele está rodando (npm run dev).");
    return;
  }

  const results = [];
  results.push(await runTest(1));
  results.push(await runTest(5));
  results.push(await runTest(10));

  console.log('\n=== RESULTADOS FINAIS PARA O RELATÓRIO ===');
  console.table(results);
}

main().catch(console.error);
