export function formatDuration(seconds: number) {
  // horas cheias (3600s = 1h)
  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0')
  // minutos totais, e o resto por 60 descarta as horas já contadas
  const totalMinutes = Math.floor(seconds / 60)
  const minutes = String(totalMinutes % 60).padStart(2, '0')
  return `${hours}:${minutes}`
}