import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { MetersTable } from '../components/MetersTable';
import { useMetersPage } from '../hooks/useMetersPage';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl} ${theme.spacing.md};
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${theme.fontSize.xxl};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text};
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  margin-top: ${theme.spacing.lg};
  align-self: flex-end;
`;

const PaginationButton = styled.button<{ $active?: boolean }>`
  min-width: 32px;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.medium};
  background: ${(props) =>
    props.$active ? theme.colors.primaryLight : theme.colors.surface};
  border: 1px solid
    ${(props) => (props.$active ? theme.colors.primary : theme.colors.border)};
  border-radius: ${theme.borderRadius.md};
  cursor: ${(props) => (props.$active ? 'default' : 'pointer')};
  transition: all ${theme.transition};

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryLight};
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Ellipsis = styled.span`
  min-width: 32px;
  text-align: center;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.md};
  user-select: none;
`;

const DEFAULT_LIMIT = 20;

function getPageFromQuery(): number {
  const params = new URLSearchParams(window.location.search);
  return Math.max(1, parseInt(params.get('page') ?? '1', 10) || 1);
}

function getLimitFromQuery(): number {
  const params = new URLSearchParams(window.location.search);
  return Math.max(
    1,
    parseInt(params.get('limit') ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT
  );
}

function updateQuery(page: number, limit: number) {
  const url = new URL(window.location.href);
  url.searchParams.set('page', String(page));
  url.searchParams.set('limit', String(limit));
  window.history.replaceState(null, '', url.toString());
}

export const MetersPage = () => {
  const [limit] = useState(() => getLimitFromQuery());
  const [offset, setOffset] = useState(() => {
    const page = getPageFromQuery();
    return (page - 1) * limit;
  });

  const currentPage = offset / limit + 1;

  const { total, meters, deleteMeter, isLoading, isError } = useMetersPage(
    offset,
    limit
  );

  const totalPages = total ? Math.ceil(total / limit) : 1;
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const goToPage = useCallback(
    (page: number) => {
      setOffset((page - 1) * limit);
    },
    [limit]
  );

  useEffect(() => {
    updateQuery(currentPage, limit);
  }, [currentPage, limit]);

  const handlePopState = useCallback(() => {
    setOffset((getPageFromQuery() - 1) * limit);
  }, [limit]);

  useEffect(() => {
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [handlePopState]);

  return (
    <PageContainer>
      <PageHeader>
        <Title>Список счетчиков</Title>
      </PageHeader>

      <MetersTable
        offset={offset}
        meters={meters}
        deleteMeter={deleteMeter}
        isLoading={isLoading}
        isError={isError}
      />

      {totalPages > 1 && (
        <PaginationContainer>
          {pageNumbers.map((item, idx) =>
            item === 'ellipsis' ? (
              <Ellipsis key={`ellipsis-${idx}`}>...</Ellipsis>
            ) : (
              <PaginationButton
                key={item}
                $active={item === currentPage}
                onClick={() => goToPage(item as number)}
              >
                {item}
              </PaginationButton>
            )
          )}
        </PaginationContainer>
      )}
    </PageContainer>
  );
};

function getPageNumbers(
  current: number,
  total: number
): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];

  if (current > 3) {
    pages.push('ellipsis');
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push('ellipsis');
  }

  pages.push(total);
  return pages;
}
