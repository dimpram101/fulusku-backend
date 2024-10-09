export function exclude<T extends object, Key extends keyof T>(
  data: T,
  keys: Key[]
): Omit<T, Key> | T {
  if (typeof data === "object" && data !== null) {
    return Object.fromEntries(
      Object.entries(data).filter(([key]) => !keys.includes(key as Key))
    ) as Omit<T, Key>;
  }
  return data;
}
