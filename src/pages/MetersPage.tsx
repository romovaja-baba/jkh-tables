import { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { MetersTable } from '../components/MetersTable';
import { useMetersPage } from '../hooks/useMetersPage';

const PageContainer = styled.div`
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

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.lg};
  padding: ${theme.spacing.md};
`;

const PaginationButton = styled.button<{ $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.medium};
  color: ${(props) =>
    props.$disabled ? theme.colors.textMuted : theme.colors.primary};
  background: ${theme.colors.surface};
  border: 1px solid
    ${(props) => (props.$disabled ? theme.colors.border : theme.colors.primary)};
  border-radius: ${theme.borderRadius.md};
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  transition: all ${theme.transition};
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryLight};
    border-color: ${theme.colors.primaryHover};
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }
`;

const PageIndicator = styled.span`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.textSecondary};
  min-width: 120px;
  text-align: center;
`;

export const MetersPage = () => {
  const [offset, setOffset] = useState(0);
  const { total, meters, deleteMeter, isLoading, isError } =
    useMetersPage(offset);

  const currentPage = offset + 1;
  const totalPages = total ? Math.ceil(total / 20) : 1;

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

      {!isLoading && !isError && (
        <Pagination>
          <PaginationButton
            $disabled={offset === 0}
            onClick={() => setOffset(Math.max(0, offset - 1))}
            disabled={offset === 0}
          >
            ← Назад
          </PaginationButton>
          <PageIndicator>
            Страница {currentPage} из {totalPages}
          </PageIndicator>
          <PaginationButton
            $disabled={(offset + 1) * 20 >= (total ?? 0)}
            onClick={() => setOffset(offset + 1)}
            disabled={(offset + 1) * 20 >= (total ?? 0)}
          >
            Вперёд →
          </PaginationButton>
        </Pagination>
      )}
    </PageContainer>
  );
};
