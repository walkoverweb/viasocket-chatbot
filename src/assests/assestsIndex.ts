import socketIcon from "./socketIcon.png";
import socketAIIcon from "./Viasocket_AI.svg";
import defaultApp from "./App.png";
import aiIcon from "./aiLogo.png";
import humanIcon from "./human-icon.svg";
import chatbotGif from "./chatbotGif.gif";

export const ChatBotIcon = socketAIIcon;
export const SocketIcon = socketIcon;
export const DefaultApp = defaultApp;
export const AiIcon = aiIcon;
export const HumanIcon = humanIcon;
export const ChatBotGif = chatbotGif;

function makeImageUrl(imageId: string): string {
  return `https://imagedelivery.net/Vv7GgOGQbSyClWJqhyP0VQ/${imageId}/public`;
}

export const AI_WHITE_ICON = makeImageUrl(
  "b1357e23-2fc6-4dc3-855a-7a213b1fa100"
);
export const AI_BLACK_ICON = makeImageUrl(
  "91ee0bff-cfe3-4e2d-64e5-fadbd9a3a200"
);
