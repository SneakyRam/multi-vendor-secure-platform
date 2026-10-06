// @ts-nocheck
export const parsePagination = (query: { page?: any; pageSize?: any }) => {
  const page = Math.max(1, parseInt(query.page as string, 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(query.pageSize as string, 10) || 20));
  const skip = (page - 1) * pageSize;
  return { page, pageSize, skip };
};

export const buildPaginationMeta = (total: number, page: number, pageSize: number) => {
  const totalPages = Math.ceil(total / pageSize);
  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};
