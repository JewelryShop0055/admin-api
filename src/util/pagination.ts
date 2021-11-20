export function paginationValidator(
  page: number,
  limit = 10,
  defaultLimit = 10,
  min = 1,
  max = 30,
) {
  if (isNaN(page)) {
    page = 1;
  } else if (page < 1) {
    page = 1;
  }

  if (isNaN(limit)) {
    limit = defaultLimit;
  } else if (limit < min) {
    limit = min;
  } else if (limit > max) {
    limit = max;
  }

  return {
    currentPage: page,
    limit,
    offset: (page - 1) * limit,
  };
}
