import React, { useEffect, KeyboardEvent, useRef, useMemo } from "react";
import { useTable, useSortBy, Row, Column } from "react-table";
import { t } from "../..";
import clsx from "clsx";
import DeleteIcon from "../../assets/delete-icon.svg";
import BarChartIcon from "../../assets/bar-chart-icon.svg";

import css from "./table.scss";

export interface IColumnMeta {
  numeric?: boolean;
  graphSelection?: boolean;
  noPadding?: boolean;
}

export const selectedRowStyleNames = ["selected1", "selected2"] as const;
export type SelectedRowStyleName = typeof selectedRowStyleNames[number];

export type SelectedRows = Record<number, SelectedRowStyleName>;

export interface ITableProps<Data> {
  data: Data[];
  columns: Column[];
  columnsMeta: IColumnMeta[];
  onRowDelete: () => void;
  onClearTable: () => void;
  activeRow: number;
  disabled: boolean;
  onActiveRowChange: (activeRowId: number) => void;
  selectedRows: SelectedRows;
  onSelectedRowsChange: (selectedRows: SelectedRows) => void;
  customHeader?: JSX.Element;
  headerGroupTitle?: React.CSSProperties[];
  centerHeader?: boolean; //used in Plant-Lab, header title and contents are centered
  noWrapDeleteButton?: boolean;
  maxWidthDeleteButton?: number;
}

// Clear table button is disabled for now, but there was a request to make it easy to re-enable it later.
const clearTableButtonAvailable = false;

const objectValues = (obj: any) => Object.keys(obj).map(key => obj[key]);

const getAvailableStyles = (selectedRows?: SelectedRows): SelectedRowStyleName[] => {
  if (!selectedRows) {
    return selectedRowStyleNames.slice();
  }
  const usedStyles: SelectedRowStyleName[] = objectValues(selectedRows);
  return selectedRowStyleNames.filter(s => !usedStyles.includes(s));
};

const TableComponent = <Data extends object>(props: ITableProps<Data>) => {
  const { columns, columnsMeta, data, activeRow, onActiveRowChange, selectedRows, disabled, onSelectedRowsChange,
    onRowDelete, onClearTable, customHeader, headerGroupTitle, centerHeader, noWrapDeleteButton, maxWidthDeleteButton } = props;

  const activeRowRef = useRef<HTMLTableRowElement>(null);

  const isGraphSelectionDisabled = !columnsMeta.find(c => c.graphSelection);

  const finalColumns = useMemo(() =>
    isGraphSelectionDisabled ?
    columns :
    [
      {
        accessor: "__graph_selection__" as const,
        disableSortBy: true,
        Cell: ({ row }: { row: Row }) => {
          const availableStyles = getAvailableStyles(selectedRows);
          const isSelected = !!selectedRows[Number(row.id)];
          const selectionDisabled = !selectedRows?.[Number(row.id)] && availableStyles.length === 0;

          const onChange = () => {
            const newSelectedRows = { ...selectedRows };
            if (isSelected) {
              // Unselect
              delete newSelectedRows[Number(row.id)];
            } else if (availableStyles.length > 0) {
              // Assign available selection style.
              newSelectedRows[Number(row.id)] = availableStyles.shift() as SelectedRowStyleName;
            }
            onSelectedRowsChange(newSelectedRows);
          };
          const onClick = (e: React.MouseEvent) => {
            // Stop propagation of click event to prevent row selection.
            e.stopPropagation();
          };

          const buttonClasses = {
            [css.barChartButton]: true,
            [css.disabled]: selectionDisabled,
            [css.canBeSelected1]: !selectedRows?.[Number(row.id)] && availableStyles[0] === "selected1",
            [css.canBeSelected2]: !selectedRows?.[Number(row.id)] && availableStyles[0] === "selected2",
            [css.selected1]: selectedRows?.[Number(row.id)] === "selected1",
            [css.selected2]: selectedRows?.[Number(row.id)] === "selected2",
          };
          return (
            <div className={css.selectRowCheckbox}>
              <div className={css.container}>
                {/* Keep real input element for accessibility and keyboard navigation */}
                <input type="checkbox" checked={isSelected} onChange={onChange} onClick={onClick} disabled={selectionDisabled} />
                {/* barChartButtonBackground covers input but passes through all the pointer events */}
                <div className={css.barChartButtonBackground} />
                <div className={clsx(buttonClasses)}>
                  <BarChartIcon />
                </div>
              </div>
            </div>
          );
        },
        width: 40
      },
      ...columns
    ]
  , [columns, isGraphSelectionDisabled, onSelectedRowsChange, selectedRows]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns: finalColumns,
    data,
    autoResetSortBy: false,
  }, useSortBy);

  useEffect(() => {
    // Make sure that activeRow is never bigger than data length (it can happen after the last row is deleted).
    if (activeRow > data.length - 1) {
      onActiveRowChange?.(activeRow - 1);
    }
  }, [data, activeRow, onActiveRowChange]);

  useEffect(() => {
    activeRowRef.current?.scrollIntoView?.({ behavior: "smooth", block: "center" });
  }, [activeRow]);

  const handleRowDelete = () => {
    if (disabled) {
      return;
    }
    const newSelectedRows: SelectedRows = {};
    const oldSelectedRows = selectedRows || {};
    // Update selected rows.
    Object.keys(oldSelectedRows).forEach(idString => {
      const id = Number(idString);
      if (id > activeRow) {
        newSelectedRows[id - 1] = oldSelectedRows[id];
      }
      if (id < activeRow) {
        newSelectedRows[id] = oldSelectedRows[id];
      }
    });
    onSelectedRowsChange?.(newSelectedRows);
    onRowDelete();
  };

  const handleClearTable = () => {
    if (disabled) {
      return;
    }
    onActiveRowChange?.(0);
    onSelectedRowsChange?.({});
    onClearTable();
  };

  const deleteButtonStyle: React.CSSProperties = maxWidthDeleteButton ? {maxWidth: maxWidthDeleteButton} : {};

  return (
    <div className={clsx(css.tableContainer, { [css.disabled]: disabled })}>
      <div className={css.header}>
        <span>{ t("TABLE.TITLE") }</span>
        { customHeader }
        <button className={clsx({[css.noWrap]: noWrapDeleteButton})} style={deleteButtonStyle} onClick={handleRowDelete} disabled={disabled}><DeleteIcon />{ t("TABLE.DELETE_TRIAL") }</button>
        { clearTableButtonAvailable && <button onClick={handleClearTable} disabled={disabled}>{ t("TABLE.CLEAR") }</button> }
      </div>
      <table className={css.table} {...getTableProps()}>
        <thead>
          {
            headerGroupTitle &&
            <tr key={"top-header"}>
              <th style={headerGroupTitle[0]}/><th style={headerGroupTitle[1]} rowSpan={2}>{t("TABLE_HEADER.STARTING_CONDITIONS")}</th><th style={headerGroupTitle[2]} colSpan={4}>{t("TABLE_HEADER.CHANGEINMASS")}</th>
            </tr>
          }
          {headerGroups.map((headerGroup, index) => {
            const { key: keyTr, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
            return (
              <tr key={keyTr} {...restHeaderGroupProps}>
                {
                  headerGroup.headers.map((column, idx) => {
                  const { key: keyTh, style, ...restColumn } = column.getHeaderProps(column.getSortByToggleProps());
                  const meta = columnsMeta[idx];
                  return (idx===1 && headerGroupTitle) ? null :
                  (
                    <th
                      key={keyTh}
                      {...restColumn}
                      className={clsx({ [css.numeric]: meta.numeric, [css.sortable]: !column.disableSortBy, [css.sorted]: column.isSorted, [css.headerGroupTitleBorder]: headerGroupTitle && idx !== 0 && idx !== 1, [css.headerGroupTitleNoBorder]: headerGroupTitle && (idx === 0 || idx === 1)})}
                      style={{...style, width: column.width, textAlign: (centerHeader) ? "center": "left"}}
                      >{column.render("Header")}
                    </th>
                  );
                  })
                }
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps}>
          {rows.map((row) => {
            prepareRow(row);
            const rowId = Number(row.id);
            const onClick = () => {
              if (!disabled) {
                onActiveRowChange?.(rowId);
              }
            };
            const onKeyDown = (e: KeyboardEvent<HTMLTableRowElement>) => {
              if (!disabled && (e.target as HTMLElement).tagName.toLowerCase() === "tr" && e.code === "Space") {
                onActiveRowChange?.(rowId);
                // Prevent default behavior of scrolling that often places the selected row behind the sticky header.
                // Scrolling is handled by the useEffect above.
                e.preventDefault();
              }
            };

            const { key: keyTr, ...restRowProps } = row.getRowProps();
            const isActive = activeRow === rowId;
            return (
              <tr
                key={keyTr} {...restRowProps} ref={isActive ? activeRowRef : undefined}
                onClick={onClick} onKeyDown={onKeyDown} tabIndex={0}
                className={isActive ? css.activeRow : ""}
              >
                {row.cells.map((cell, idx) => {
                  const { key: keyTd, ...restCellProps } = cell.getCellProps();
                  const meta = columnsMeta[idx];
                  return (
                    <td
                      key={keyTd}
                      {...restCellProps}
                      className={clsx({
                        [css.numeric]: meta.numeric,
                        [css.graphSelection]: meta.graphSelection,
                        [css.noPadding]: meta.noPadding,
                      })}
                      style={{width: cell.column.width, textAlign: (centerHeader && idx !== 1) ? "center": "left"}} //Do not center Starting Conditions
                    >
                    {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const Table = React.memo(TableComponent) as typeof TableComponent;
