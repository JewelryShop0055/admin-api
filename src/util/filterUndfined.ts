export function filterToObject<T = unknown>(obj: T) {
  Object.keys(obj).forEach(
    (key) =>
      (obj[key] === undefined && delete obj[key]) ||
      (typeof obj[key] === "object" && (obj[key] = filterToObject(obj[key]))),
  );
  return obj;
}
