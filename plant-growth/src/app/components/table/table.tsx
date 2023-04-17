import React, { useEffect, KeyboardEvent, useRef } from "react";
import { useTable, useSortBy, Column } from "react-table";
import DeleteIcon from "../../assets/delete-icon.svg";
import clsx from "clsx";

import css from "./table.scss";

export interface IColumnMeta {
  numeric?: boolean;
  graphSelection?: boolean;
  noPadding?: boolean;
}

export interface ITableProps<Data> {
  data: Data[];
  columns: Column[];
  columnsMeta: IColumnMeta[];
  onRowDelete: () => void;
  onClearTable: () => void;
  activeRow: number;
  disabled: boolean;
  onActiveRowChange: (activeRowId: number) => void;
  customHeader?: JSX.Element;
  headerGroupTitle?: React.CSSProperties[];
  centerHeader?: boolean; //used in Plant-Lab, header title and contents are centered
  noWrapDeleteButton?: boolean;
  maxWidthDeleteButton?: number;
  t: (string: string) => string | JSX.Element;
}

const TableComponent = <Data extends object>(props: ITableProps<Data>) => {
  const { columns, data, activeRow, onActiveRowChange, disabled,
    onRowDelete, centerHeader, t } = props;

  const activeRowRef = useRef<HTMLTableRowElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
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
    // only apply if # of rows is greater than 4, otherwise whole page scrolls
    if (activeRow >= 4) {
      tableRef.current?.scrollTo({
        top:  activeRowRef.current?.getBoundingClientRect().x,
        behavior: "smooth",
      });
    }
  }, [activeRow]);

  const handleRowDelete = () => {
    if (disabled) {
      return;
    }
    onRowDelete();
  };


  return (
    <div className={clsx(css.tableContainer, { [css.disabled]: disabled })}>
      <div className={css.header}>
        <span className={css.title}>{t("TABLE.TITLE")}</span>
        <div className={css.deleteButtonContainer}>
          <div className={css.label}>{t("TABLE.DELETE_TRIAL")}:</div>
          <button
            className={clsx(css.noWrap)}
            onClick={handleRowDelete}
            disabled={disabled}>
              <DeleteIcon />
          </button>
        </div>
      </div>
      <table ref={tableRef} className={css.table} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, index) => {
            const { key: keyTr, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
            return (
              <tr className={css.headerRow} key={keyTr} {...restHeaderGroupProps}>
                {
                  headerGroup.headers.map((column, idx) => {
                  const { key: keyTh, style, ...restColumn } = column.getHeaderProps(column.getSortByToggleProps());
                  return (
                    <th
                      key={keyTh}
                      {...restColumn}
                      style={{...style, cursor: (column.disableSortBy || disabled) ? "default" : "pointer", width: column.width, textAlign: (centerHeader) ? "center": "left"}}
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
          {rows.map((row, index) => {
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
                  return (
                    <td
                      key={keyTd}
                      {...restCellProps}
                      style={{width: cell.column.width, textAlign: "center"}} //Do not center Starting Conditions
                    >
                    {idx === 0 ? index + 1 : cell.render("Cell")}
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
