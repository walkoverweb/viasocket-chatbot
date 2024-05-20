import { errorToast } from "../../components/customToast";
import axios from "../../interceptor/interceptor";
import { InterFaceDataType } from "../../types/interface/InterfaceReduxType.ts";
import { UrlDataType } from "../../types/utility.ts";

const URL = process.env.REACT_APP_API_BASE_URL;

export async function getAllInterfaceApi(
  projectId: string
): Promise<{ [key: string]: any }[]> {
  const response = await axios.get(
    `${URL}/projects/${projectId}/interfaces/getAllInterfaces`
  );
  return response?.data?.data;
}

export async function createInterfaceApi(
  data: InterFaceDataType,
  urlData: UrlDataType
): Promise<{ [key: string]: any }[]> {
  const { orgId, projectId } = urlData;
  const response = await axios.post(`${URL}/projects/${projectId}/interfaces`, {
    ...data,
    org_id: orgId,
    project_id: projectId,
    config: {
      type: "popup",
      height: "50",
      heightUnit: "%",
      width: "500",
      widthUnit: "px",
    },
  });
  return response?.data?.data;
}

export async function updateInterfaceApi(
  data: InterFaceDataType,
  urlData: UrlDataType
): Promise<{ [key: string]: any }[]> {
  const { orgId, projectId, interfaceId } = urlData;
  const response = await axios.put(
    `${URL}/projects/${projectId}/interfaces/${interfaceId}/update`,
    {
      ...data,
      org_id: orgId,
      project_id: projectId,
    }
  );
  return response?.data?.data;
}

export async function updateInterfaceActionsApi(
  data: InterFaceDataType,
  urlData: UrlDataType
): Promise<{ [key: string]: any }[]> {
  const { orgId, projectId, interfaceId } = urlData;
  const response = await axios.put(
    `${URL}/projects/${projectId}/interfaces/${interfaceId}/updateAction`,
    {
      ...data,
      org_id: orgId,
      project_id: projectId,
    }
  );
  return response?.data?.data;
}
export async function updateInterfaceDetailsApi(
  data: InterFaceDataType,
  urlData: UrlDataType
): Promise<{ [key: string]: any }[]> {
  const { projectId } = urlData;
  const { interfaceId: dataInterfaceId, ...dataToSend } = data; // Renamed to avoid variable shadowing
  const interfaceId = dataInterfaceId || urlData.interfaceId;
  const response = await axios.put(
    `${URL}/projects/${projectId}/interfaces/${interfaceId}/updateInterfaceDetails`,
    dataToSend
  );
  return response?.data?.data;
}

export async function deleteInterfaceApi(
  data: InterFaceDataType,
  urlData: UrlDataType
): Promise<{ [key: string]: any }[]> {
  const { projectId } = urlData;
  const { interfaceId } = data;
  const response = await axios.delete(
    `${URL}/projects/${projectId}/interfaces/${interfaceId}`
  );
  return response?.data?.data;
}

export async function getInterfaceByIdApi(
  interfaceId: string
): Promise<{ [key: string]: any }[]> {
  const response = await axios.get(
    `${URL}/interfaces/${interfaceId}/getoneinterface`
  );
  return response?.data?.data;
}

export async function deleteComponentOrGridApi(
  interfaceId: string,
  gridId: string,
  componentId: string,
  urlData: UrlDataType
): Promise<{ [key: string]: any }[]> {
  const { projectId } = urlData;
  const requestBody = {
    componentId: componentId,
  };
  const response = await axios.delete(
    `${URL}/projects/${projectId}/interfaces/${interfaceId}/grid/${gridId}`,
    {
      data: requestBody,
    }
  );
  return response?.data?.data;
}

export async function getPreviousMessage(
  interfaceId: string,
  threadId: string | null,
  bridge: string | null,
  actionId: string | null
): Promise<{ [key: string]: any }[]> {
  const response = await axios.get(
    `${URL}/interfaces/${interfaceId}/getData?threadId=${
      threadId || ""
    }&bridgeName=${bridge}&actionId=${actionId}`
  );
  return response?.data?.data;
}
export async function sendDataToAction(
  actionId: string,
  data: any
): Promise<{ [key: string]: any }[]> {
  if (!data.threadId) data.threadId = "";

  const response = await axios.post(`${URL}/interfaces/action/${actionId}`, {
    ...data,
  });
  return response?.data?.data;
}

export async function loginUser(data: any): Promise<{ [key: string]: any }[]> {
  const response = await axios.post(`${URL}/chatbot/login`, {
    ...data,
  });
  return response?.data?.data;
}

export const createScripts = async (data: any, type = "flow") => {
  try {
    data.type = type;
    const res = await axios.post(
      `${URL}/projects/${data?.project_id}/scripts`,
      data
    );
    return res;
  } catch (error: any) {
    console.error(error);
    errorToast(error?.response?.data?.message || "Something went wrong!");
    throw new Error(error);
  }
};
