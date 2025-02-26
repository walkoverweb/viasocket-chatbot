import { DataGrid, GridPaginationMeta, useGridApiRef } from "@mui/x-data-grid";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { GridContext } from "../Grid/Grid";

function generateColumns(data) {
  // Check if data is an object and not null
  if (typeof data !== "object" || data === null) {
    console.error("Invalid data format. Expected an object.");
    return [];
  }
  // Generate columns
  return Object.keys(data || {}).map((key) => ({
    id: key, // Use the key as the unique ID for each column definition
    field: key,
    headerName: key.toString().toUpperCase(),
    flex: 1,
  }));
}

function generateRows(data: any) {
  // Check if data is an array
  if (!Array.isArray(data)) {
    console.error("Invalid data format. Expected an array.");
    return [];
  }
  // Generate rows
  return (data || []).map((row, index) => ({ id: index, ...row }));
}
interface InterfaceTableProps {
  props: any;
  meta?: {
    nextPageVariableGenerator?: string;
    previousPageVariableGenerator?: string;
    currentPageInputVariable?: any;
    currentPageOutputPaginationVariables?: any;
    apiCallId?: string;
    propsPath?: string;
  };
}
interface PaginationModel {
  page: number;
  pageSize: number;
  eventType?: "next" | "previous";
}

function InterfaceTable({ props, meta, propsPath }: InterfaceTableProps) {
  const {
    nextPageVariableGenerator,
    previousPageVariableGenerator,
    currentPageInputVariable,
    currentPageOutputPaginationVariables,
    apiCallId,
  } = meta || {};
  const columns = generateColumns(props?.data?.[0]);
  const [rows, setRows] = useState(generateRows(props?.data));
  const apiRef = useGridApiRef();
  const dataPath = propsPath?.data?.replace(/^variables\./, "");

  const [paginationModel, setPaginationModel] = React.useState<PaginationModel>(
    {
      page: 0,
      pageSize: 5,
    }
  );

  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationVariables, setPaginationVariables] = useState(
    currentPageOutputPaginationVariables
  );
  const [inputVariables, setInputVariables] = useState(
    currentPageInputVariable
  );

  const fetchRows = async () => {
    try {
      let variables = inputVariables;
      setIsLoading(true);
      // Execute next/previous page generator functions based on page change
      if (paginationModel.eventType === "next" && hasNextPage) {
        const generatorFunction = new Function(
          "outputResponseOfCurrentApiCall",
          "inputVariableOfCurrentApiCall",
          nextPageVariableGenerator
        );
        variables = generatorFunction(paginationVariables, inputVariables);
        // console.log(variables, 'variables')
      } else if (paginationModel.eventType === "previous") {
        const generatorFunction = new Function(
          "outputResponseOfCurrentApiCall",
          "inputVariableOfCurrentApiCall",
          previousPageVariableGenerator
        );
        variables = generatorFunction(paginationVariables, inputVariables);
      }

      const response = await axios.post(
        `https://flow.sokt.io/func/${apiCallId}`,
        variables
      );
      setRows(response.data?.[dataPath]); // todo: how to detect keys
      setPaginationVariables(response.data);
      setInputVariables(variables);
      setHasNextPage(
        Array.isArray(response?.data[dataPath])
          ? response?.data[dataPath]?.length > 0
          : false
      ); // todo: how to detect keys
    } catch (error) {
      console.error("Error fetching data:", error);
      setRows([]);
      setHasNextPage(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, [paginationModel.eventType, paginationModel.page]);

  const paginationMetaRef = React.useRef<GridPaginationMeta>();

  // Memoize to avoid flickering when the `hasNextPage` is `undefined` during refetch
  const paginationMeta = React.useMemo(() => {
    if (
      hasNextPage !== undefined &&
      paginationMetaRef.current?.hasNextPage !== hasNextPage
    ) {
      paginationMetaRef.current = { hasNextPage };
    }
    return paginationMetaRef.current;
  }, [hasNextPage]);

  return (
    <DataGrid
      apiRef={apiRef}
      rows={rows || []}
      // columns={columns || []}
      columns={[{ field: "id", headerName: "ID" }]}
      initialState={{
        pagination: { rowCount: paginationVariables?.total || -1 },
      }}
      paginationMeta={paginationMeta}
      loading={isLoading}
      pageSizeOptions={[currentPageInputVariable?.limit || 5]}
      paginationModel={paginationModel}
      paginationMode="server"
      onPaginationModelChange={(model, details) => {
        const eventType =
          model?.page > details?.api?.state?.pagination?.paginationModel?.page
            ? "next"
            : "previous";
        setPaginationModel({ ...model, eventType });
      }}
    />
  );
}

export default InterfaceTable;
