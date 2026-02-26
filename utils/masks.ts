/**
 * Utilitários para máscaras de formatação
 */

/**
 * Aplica máscara de data (DD/MM/AAAA)
 */
export function maskDate(value: string): string {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 8 dígitos
  const limited = numbers.slice(0, 8);
  
  // Aplica a máscara
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 4) {
    return `${limited.slice(0, 2)}/${limited.slice(2)}`;
  } else {
    return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4, 8)}`;
  }
}

/**
 * Aplica máscara de CPF (000.000.000-00)
 */
export function maskCPF(value: string): string {
  const numbers = value.replace(/\D/g, '');
  const limited = numbers.slice(0, 11);
  
  if (limited.length <= 3) {
    return limited;
  } else if (limited.length <= 6) {
    return `${limited.slice(0, 3)}.${limited.slice(3)}`;
  } else if (limited.length <= 9) {
    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
  } else {
    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9, 11)}`;
  }
}

/**
 * Aplica máscara de telefone ((00) 00000-0000)
 */
export function maskPhone(value: string): string {
  const numbers = value.replace(/\D/g, '');
  const limited = numbers.slice(0, 11);
  
  if (limited.length <= 2) {
    return limited.length > 0 ? `(${limited}` : '';
  } else if (limited.length <= 7) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
  } else {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7, 11)}`;
  }
}

/**
 * Aplica máscara de CEP (00000-000)
 */
export function maskCEP(value: string): string {
  const numbers = value.replace(/\D/g, '');
  const limited = numbers.slice(0, 8);
  
  if (limited.length <= 5) {
    return limited;
  } else {
    return `${limited.slice(0, 5)}-${limited.slice(5, 8)}`;
  }
}

/**
 * Remove máscara de data e retorna no formato YYYY-MM-DD
 */
export function unmaskDate(value: string): string {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length === 8) {
    const day = numbers.slice(0, 2);
    const month = numbers.slice(2, 4);
    const year = numbers.slice(4, 8);
    return `${year}-${month}-${day}`;
  }
  
  return value;
}

/**
 * Converte data do formato YYYY-MM-DD para DD/MM/AAAA
 */
export function formatDateFromBackend(dateString: string): string {
  if (!dateString) return '';
  
  // Se já está no formato DD/MM/AAAA, retorna como está
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    return dateString;
  }
  
  // Tenta converter de YYYY-MM-DD
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

