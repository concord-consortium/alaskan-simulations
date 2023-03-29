import React, { useEffect, KeyboardEvent, useRef } from "react";
import { useTable, useSortBy, Column } from "react-table";
import { t } from "../../translation/translate";
import clsx from "clsx";
import DeleteIcon from "../../assets/delete-icon.svg";

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
}

// Clear table button is disabled for now, but there was a request to make it easy to re-enable it later.
const clearTableButtonAvailable = false;

const TableComponent = <Data extends object>(props: ITableProps<Data>) => {
  const { columns, data, activeRow, onActiveRowChange, disabled,
    onRowDelete, onClearTable, centerHeader, noWrapDeleteButton, maxWidthDeleteButton } = props;

  const activeRowRef = useRef<HTMLTableRowElement>(null);

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
    activeRowRef.current?.scrollIntoView?.({ behavior: "smooth", block: "center" });
  }, [activeRow]);

  const handleRowDelete = () => {
    if (disabled) {
      return;
    }
    onRowDelete();
  };

  const handleClearTable = () => {
    if (disabled) {
      return;
    }
    onActiveRowChange?.(0);
    onClearTable();
  };

  const deleteButtonStyle: React.CSSProperties = maxWidthDeleteButton ? {maxWidth: maxWidthDeleteButton} : {};

  return (
    <div className={clsx(css.tableContainer, { [css.disabled]: disabled })}>
      <div className={css.header}>
        <span className={css.title}>{ t("TABLE.TITLE") }</span>
        <button className={clsx({[css.noWrap]: noWrapDeleteButton})} style={deleteButtonStyle} onClick={handleRowDelete} disabled={disabled}><DeleteIcon />{ t("TABLE.DELETE_TRIAL") }</button>
        { clearTableButtonAvailable && <button onClick={handleClearTable} disabled={disabled}>{ t("TABLE.CLEAR") }</button> }
      </div>
      <table className={css.table} {...getTableProps()}>
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
                      style={{...style, cursor: (!column.disableSortBy && !disabled) ? "default" : "pointer", width: column.width, textAlign: (centerHeader) ? "center": "left"}}
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
