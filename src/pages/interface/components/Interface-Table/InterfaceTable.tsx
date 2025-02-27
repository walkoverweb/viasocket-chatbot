import { DataGrid, GridPaginationMeta, useGridApiRef } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";

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
    nextPageVariableGenerator?: any;
    previousPageVariableGenerator?: string;
    currentPageInputVariable?: any;
    currentPageOutputPaginationVariables?: any;
    apiCallId?: string;
    propsPath?: string;
    outputDataKey?: string;
  };
  propsPath?: {
    data?: string;
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
    currentPageInputVariable,
    currentPageOutputPaginationVariables,
    apiCallId,
    outputDataKey,
  } = meta || {};
  const columns = generateColumns(props?.data?.[0]);
  const [rows, setRows] = useState(generateRows(props?.data));
  const apiRef = useGridApiRef();
  const path: any | { data: string } = outputDataKey || propsPath || "data";
  const dataPath =
    path?.replace(/^variables\./, "") ||
    propsPath?.data?.replace(/^variables\./, "");

  const [paginationModel, setPaginationModel] = React.useState<PaginationModel>(
    {
      page: 0,
      pageSize: currentPageInputVariable?.limit || 5,
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

  // Store all fetched pages data
  const [pagesData, setPagesData] = useState<{ [key: number]: any[] }>({
    0: props?.data || [],
  });

  const fetchRows = async () => {
    try {
      let variables = inputVariables;
      setIsLoading(true);

      // If going to previous page and we have the data, use cached data
      if (
        paginationModel.eventType === "previous" &&
        pagesData[paginationModel.page]
      ) {
        setRows(generateRows(pagesData[paginationModel.page]));
        setIsLoading(false);
        return;
      }

      // Execute next page generator function
      if (paginationModel.eventType === "next" && hasNextPage) {
        const generatorFunction = new Function(
          "outputResponseOfCurrentApiCall",
          "inputVariableOfCurrentApiCall",
          nextPageVariableGenerator
        );
        variables = generatorFunction(paginationVariables, inputVariables);
      }

      const response = await axios.post(
        `https://flow.sokt.io/func/${apiCallId}`,
        variables
      );

      const newData = response.data?.[dataPath];
      setRows(generateRows(newData));
      setPaginationVariables(response.data);
      setInputVariables(variables);

      // Store the new page data
      setPagesData((prev) => ({
        ...prev,
        [paginationModel.page]: newData,
      }));

      setHasNextPage(Array.isArray(newData) ? newData?.length > 0 : false);
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
      columns={columns || []}
      // columns={[{ field: "id", headerName: "ID" }]}
      initialState={{
        pagination: { rowCount: paginationVariables?.total || -1 },
      }}
      paginationMeta={paginationMeta}
      loading={isLoading}
      pageSizeOptions={[currentPageInputVariable?.limit || 5, 10, 20]}
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
