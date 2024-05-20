import React, { FC } from "react";
import { useSearchParams, useParams } from "react-router-dom";

export default function addUrlDataHoc(
  WrappedComponent: FC<any>,
  paramsToInject?: string[]
) {
  return function addUrlDataHoc(props: any) {
    const urlParams = useParams();
    const setSearchParams = useSearchParams()[1];
    const data: { [key: string]: string | boolean | undefined } = {};
    paramsToInject?.forEach((key: string) => {
      data.interfaceId = urlParams[key];
    });

    return (
      <WrappedComponent
        {...props}
        {...data}
        setSearchParams={setSearchParams}
      />
    );
  };
}
