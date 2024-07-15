export function getUTCDateTime(dateString: string): string {
    const date = new Date(dateString);
    const hours = ('0' + date.getUTCHours()).slice(-2);
    const minutes = ('0' + date.getUTCMinutes()).slice(-2);
    return `  ${hours} Horas con ${minutes} Minutos`;
  }

