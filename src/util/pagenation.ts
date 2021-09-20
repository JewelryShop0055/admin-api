export function pagenationValidator(
  page: number,
  limit = 10,
  defaultLimit = 10,
  min = 0,
  max = 30,
) {
  if (isNaN(page)) {
    page = 0;
  } else if (page < 0) {
    page = 0;
  }

  if (isNaN(limit)) {
    limit = defaultLimit;
  } else if (limit < min) {
    limit = min;
  } else if (limit > max) {
    limit = max;
  }

  return {
    page,
    limit,
  };
}
