import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { MetersTable } from '../components/MetersTable';
import { useMetersPage } from '../hooks/useMetersPage';
import { getPageNumbers } from '../helper';

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
    props.$active ? theme.colors.secondaryHover : theme.colors.surface};
  border: 1px solid ${theme.colors.secondaryBorder};
  border-radius: ${theme.borderRadius.md};
  cursor: ${(props) => (props.$active ? 'default' : 'pointer')};
  transition: all ${theme.transition};

  &:hover:not(:disabled) {
    background: ${(props) =>
      props.$active ? theme.colors.secondaryHover : theme.colors.primaryLight};
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

export const MetersPage = () => {
  const [offset, setOffset] = useState(0);
  const { total, meters, deleteMeter, isLoading, isError } =
    useMetersPage(offset);

  const currentPage = offset + 1;
  const totalPages = total ? Math.ceil(total / 20) : 1;

  const pageNumbers = useMemo(
    () => getPageNumbers(currentPage, totalPages),
    [currentPage, totalPages]
  );

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

      {!isLoading && !isError && totalPages > 1 && (
        <PaginationContainer>
          {pageNumbers.map((item, idx) =>
            item === 'ellipsis' ? (
              <Ellipsis key={`ellipsis-${idx}`}>...</Ellipsis>
            ) : (
              <PaginationButton
                key={item}
                $active={item === currentPage}
                onClick={() => setOffset(item - 1)}
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
