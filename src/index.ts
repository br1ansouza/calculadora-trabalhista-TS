import * as readline from 'readline';

type TaxBracket = {
  min: number;
  max: number | null; 
  rate: number; 
};

const TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 22847.76, rate: 0 },           // isento
  { min: 22847.77, max: 33919.80, rate: 7.5 },  // 7.5%
  { min: 33919.81, max: 45012.60, rate: 15 },   // 15%
  { min: 45012.61, max: 55976.16, rate: 22.5 }, // 22.5%
  { min: 55976.16, max: null, rate: 27.5 },     // 27.5%
];

function calcularInss(salarioBruto: number): number{
  let inss = 0

  if(salarioBruto > 4000.04){
    inss = salarioBruto * 14/100
  } else if (salarioBruto > 2666.69){
    inss = salarioBruto * 12 / 100
  } else if (salarioBruto > 1412.01){
      inss = salarioBruto * 9 / 100
  } else {
      inss = salarioBruto * 7.5 / 100
  }

  if(inss > 908.85) inss = 908.85

  return inss
}

function calcularImpostoRenda(salarioBruto: number): number {
  const inss = calcularInss(salarioBruto);
  const salarioBaseIR = salarioBruto - inss; 

  let impostoTotal = 0;

  for (const bracket of TAX_BRACKETS) {
      const { min, max, rate } = bracket;

      if (salarioBaseIR > min) {
          const rendaTributavel = max === null
              ? salarioBaseIR - min
              : Math.min(salarioBaseIR, max) - min;

          impostoTotal += rendaTributavel * (rate / 100);
      }
  }

  return parseFloat(impostoTotal.toFixed(2));
}


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Digite o salário bruto: R$', (input) => {
  const salarioBruto = parseFloat(input);

  if (isNaN(salarioBruto) || salarioBruto <= 0) {
      console.log('Digite um valor numérico válido para o salário bruto:');
  } else {
      const inss = calcularInss(salarioBruto);
      const impostoDeRenda = calcularImpostoRenda(salarioBruto);

      console.log(`\nSalário Bruto: R$${salarioBruto.toFixed(2)}`);
      console.log(`INSS: R$${inss.toFixed(2)}`);
      console.log(`Imposto de Renda: R$${impostoDeRenda.toFixed(2)}`);
      console.log(`Salário Líquido: R$${(salarioBruto - inss - impostoDeRenda).toFixed(2)}`);
  }

  rl.close();
});