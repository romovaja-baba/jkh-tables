import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import type { Meter } from '../api/metersApi';
import { useRootStore } from '../context/RootStoreContext';
import { observer } from 'mobx-react-lite';
import hvsIcon from '../assets/hvs.svg?url';
import gvsIcon from '../assets/gvs.svg?url';
import trashIcon from '../assets/trash.svg?url';

const typeIcons: Record<string, string> = {
  ColdWaterAreaMeter: hvsIcon,
  HotWaterAreaMeter: gvsIcon,
};

interface MeterRow {
  order: number;
  type: string;
  rawType: string;
  installationDate: string;
  isAutomatic: boolean;
  initialValues: string;
  address: string;
  description: string;
  id: string;
}

interface MetersTableProps {
  offset: number;
  meters: Meter[];
  deleteMeter: (meterId: string) => Promise<void>;
  isLoading: boolean;
  isError: boolean;
}

const columnHelper = createColumnHelper<MeterRow>();

const DeleteButton = observer(
  ({
    meterId,
    deleteMeter,
  }: {
    meterId: string;
    deleteMeter: (meterId: string) => Promise<void>;
  }) => {
    return (
      <StyledDeleteBtn onClick={() => deleteMeter(meterId)}>
        <img src={trashIcon} alt="" width={16} height={16} />
      </StyledDeleteBtn>
    );
  }
);

const TableWrapper = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadow.md};
  overflow: hidden;
`;

const ScrollContainer = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${theme.fontSize.md};
`;

const StyledThead = styled.thead`
  background: ${theme.colors.headerBg};
  position: sticky;
  top: 0;
  z-index: 1;
`;

const StyledTh = styled.th`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  text-align: left;
  font-weight: ${theme.fontWeight.semibold};
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid ${theme.colors.border};
  white-space: nowrap;
`;

const StyledTr = styled.tr`
  transition: background ${theme.transition};

  &:hover {
    background: ${theme.colors.primaryLight};
  }
`;

const StyledTd = styled.td`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
  color: ${theme.colors.text};
  vertical-align: middle;
`;

const TypeCell = styled.span`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const TypeIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const StyledDeleteBtn = styled.button`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.danger};
  background: transparent;
  border: 1px solid ${theme.colors.danger};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  opacity: 0;
  transition: all ${theme.transition};

  tr:hover & {
    opacity: 1;
  }

  &:hover {
    background: ${theme.colors.dangerLight};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xxl};
  color: ${theme.colors.loading};
  font-size: ${theme.fontSize.lg};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
`;

const ErrorState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xxl};
  color: ${theme.colors.error};
  font-size: ${theme.fontSize.lg};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
`;

export const MetersTable = observer(
  ({ offset, meters, deleteMeter, isLoading, isError }: MetersTableProps) => {
    const { areasMap } = useRootStore();

    const data = useMemo<MeterRow[]>(
      () =>
        meters.map((m, idx) => {
          const area = areasMap.get(m.area.id);
          const addressStr = area
            ? `${area.street}, д. ${area.building}, кв. ${area.apartment}`
            : 'Загрузка...';
          return {
            order: offset * 20 + idx + 1,
            type: m._type === 'ColdWaterAreaMeter' ? 'ХВС' : 'ГВС',
            rawType: m._type,
            installationDate: new Date(m.installation_date).toLocaleDateString(
              'ru'
            ),
            isAutomatic: m.is_automatic,
            initialValues: m.initial_values.join(', '),
            address: addressStr,
            description: m.description,
            id: m.id,
          };
        }),
      [meters, areasMap, offset]
    );

    const columns = useMemo(
      () => [
        columnHelper.accessor('order', {
          header: '№',
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('type', {
          header: 'Тип',
          cell: (info) => {
            const iconSrc = typeIcons[info.row.original.rawType[0]];
            return (
              <TypeCell>
                {iconSrc && (
                  <TypeIcon src={iconSrc} alt="" width={16} height={16} />
                )}
                {info.getValue()}
              </TypeCell>
            );
          },
        }),
        columnHelper.accessor('installationDate', {
          header: 'Дата установки',
        }),
        columnHelper.accessor('isAutomatic', {
          header: 'Автоматический',
          cell: (info) => (info.getValue() ? 'Да' : 'Нет'),
        }),
        columnHelper.accessor('initialValues', { header: 'Значение' }),
        columnHelper.accessor('address', { header: 'Адрес' }),
        columnHelper.accessor('description', { header: 'Примечание' }),
        columnHelper.display({
          id: 'delete',
          header: '',
          cell: ({ row }) => (
            <DeleteButton meterId={row.original.id} deleteMeter={deleteMeter} />
          ),
        }),
      ],
      [deleteMeter]
    );

    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) {
      return <LoadingState>Загрузка...</LoadingState>;
    }

    if (isError) {
      return <ErrorState>Ошибка при загрузке данных</ErrorState>;
    }

    return (
      <TableWrapper>
        <ScrollContainer>
          <StyledTable>
            <StyledThead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <StyledTh key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </StyledTh>
                  ))}
                </tr>
              ))}
            </StyledThead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <StyledTr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <StyledTd key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </StyledTd>
                  ))}
                </StyledTr>
              ))}
            </tbody>
          </StyledTable>
        </ScrollContainer>
      </TableWrapper>
    );
  }
);
