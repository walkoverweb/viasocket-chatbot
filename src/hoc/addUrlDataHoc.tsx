import React, { FC } from "react";
import { useSearchParams } from "react-router-dom";

export default function addUrlDataHoc(WrappedComponent: FC<any>) {
  return function addUrlDataHoc(props: any) {
    // const urlParams = useParams()
    // const location = useLocation()
    const setSearchParams = useSearchParams()[1];
    const data: { [key: string]: string | boolean | undefined } = {};

    data.orgId = "752";
    data.projectId = "proj3QrfYcn6";
    data.scriptId = "scriptId";
    data.interfaceId = "6641e344138660759c920c83";
    if (!data.tabName) data.tabName = "draft";
    return (
      <WrappedComponent
        {...props}
        {...data}
        setSearchParams={setSearchParams}
      />
    );
  };
}
