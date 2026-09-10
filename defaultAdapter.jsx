// defaultGridAdapter.js

// AG Grid infers "this is a group" purely from `children` being present —
// there is no `group` field in ColGroupDef. The service's `group: true`
// is treated as a hint/validation check, not a real AG Grid field.
const hasChildren = (column) =>
  Array.isArray(column?.children) && column.children.length > 0;

// AG Grid's own ColGroupDef shape — only fields AG Grid actually reads
const buildColumnDefTree = (column, normalizedConfig) => {
  if (hasChildren(column)) {
    return {
      headerName: column.headerName,
      groupId: column.field || column.headerName,
      marryChildren: true,
      openByDefault: column.openByDefault ?? true,
      children: column.children.map((child) =>
        buildColumnDefTree(child, normalizedConfig)
      ),
    };
  }

  // leaf column — existing buildColumnDef logic (already uses ColDef fields)
  return buildColumnDef(column, normalizedConfig);
};

export const adaptDefaultGridToAgGrid = (payload = {}, normalizedConfig) => {
  const rootColumns = Array.isArray(payload?.columns) ? payload.columns : [];

  // unchanged — still needed for row → field mapping
  const leafColumns = flattenColumns(rootColumns);

  // builds AG Grid's real ColGroupDef/ColDef tree, not a flattened list
  const columnDefs = rootColumns.map((column) =>
    buildColumnDefTree(column, normalizedConfig)
  );

  const rowData = buildRowData(payload?.rows, leafColumns);

  return {
    columnDefs,
    rowData,
  };
};
