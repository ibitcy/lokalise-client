export function logError<T>(error: T) {
  console.error('System error! ', error);
}

export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

export function mergeMaps<K, V>(maps: Array<Map<K, V> | null>): Map<K, V> {
  let merged = new Map<K, V>();

  maps.filter(Boolean).forEach(map => {
    merged = new Map<K, V>([...merged, ...map]);
  });

  return merged;
}
