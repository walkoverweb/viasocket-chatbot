import axiosInstance from "axios";
import { errorToast } from "../../components/customToast";
import axios from "../../interceptor/interceptor";
import { InterFaceDataType } from "../../types/interface/InterfaceReduxType.ts";
import { UrlDataType } from "../../types/utility.ts";

const URL = process.env.REACT_APP_API_BASE_URL;
const PYTHON_URL = process.env.REACT_APP_PYTHON_API_BASE_URL;
let currentController: AbortController | null = null;

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
  const response = await axios.get(`${URL}/chatbot/${interfaceId}/getchatbot`);
  return response?.data;
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
  threadId: string | null,
  bridgeName: string | null,
  pageNo: number | null,
  limit = 40
): Promise<{ [key: string]: any }[]> {
  if (currentController) {
    currentController.abort();
  }
  currentController = new AbortController();

  try {
    const response = await axios.get(
      `${URL}/api/v1/config/gethistory-chatbot/${threadId}/${bridgeName}?pageNo=${pageNo}&limit=${limit}`,
      { signal: currentController.signal }
    );
    return response?.data?.data.conversations;
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Request aborted:", error.message);
    } else {
      console.error("Error fetching previous messages:", error);
    }
    return [];
  }
}

export async function sendDataToAction(data: any): Promise<any> {
  try {
    if (!data.threadId) data.threadId = "";

    const response = await axios.post(
      `${PYTHON_URL}/chatbot/${data.chatBotId}/sendMessage`,
      {
        ...data,
      }
    );
    return { success: true, data: response?.data?.data };
  } catch (error) {
    errorToast(
      error?.response?.data?.detail?.error ||
        error?.response?.data?.detail ||
        "Something went wrong!"
    );
    return { success: false };
  }
}

export async function performChatAction(
  data: any
): Promise<{ [key: string]: any }[]> {
  try {
    if (!data.threadId) data.threadId = "";

    const response = await axios.post(
      `${PYTHON_URL}/chatbot/${data.chatBotId}/resetchat`,
      {
        ...data,
      }
    );
    return response?.data?.data;
  } catch (error) {
    errorToast(
      error?.response?.data?.detail?.error ||
        error?.response?.data?.detail ||
        "Something went wrong!"
    );
    return error;
  }
}

export async function sendFeedbackAction(data: {
  messageId: string;
  feedbackStatus: number;
}): Promise<{ [key: string]: any }[]> {
  try {
    const response = await axios.put(
      `${URL}/api/v1/config/status/${data?.feedbackStatus}`,
      { message_id: data?.messageId }
    );
    return response?.data;
  } catch (error) {
    errorToast(
      error?.response?.data?.detail?.error ||
        error?.response?.data?.detail ||
        "Something went wrong!"
    );
    return error;
  }
}

export async function loginUser(data: any): Promise<{ [key: string]: any }[]> {
  const response = await axios.post(`${URL}/chatbot/login`, {
    ...data,
  });
  return response?.data?.data;
}

export async function getHelloDetailsApi({
  threadId,
  slugName,
  helloId = null,
}: {
  threadId: string;
  slugName: string;
  helloId?: string | null;
}): Promise<any> {
  try {
    const response = await axios.post(`${URL}/hello/subscribe`, {
      threadId,
      slugName,
      helloId,
    });
    return response?.data;
  } catch (error) {
    console.error("Error getting hello details:", error);
    return null;
  }
}

export async function getHelloChatsApi({
  channelId,
}: {
  channelId: string;
}): Promise<any> {
  try {
    const response = await axiosInstance.post(
      "https://api.phone91.com/get-history/",
      {
        channel: channelId,
        origin: "chat",
        page_size: 30,
        start_from: 1,
        user_data: {},
        is_anon: false,
      },
      {
        headers: {
          authorization: localStorage.getItem("HelloAgentAuth"),
          "content-type": "application/json",
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Error getting hello details:", error);
    return null;
  }
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
