const EmbedVerificationStatus = {
  VERIFIED: "verified",
  NOT_VERIFIED: "notVerified",
  VERIFYING: "verifying",
};

const ParamsEnums = {
  interfaceId: "interfaceId",
  threadIdUrl: "threadIdUrl",
  slug: "slug",
  chatBotId: "chatBotId",
};

Object.freeze(EmbedVerificationStatus);
Object.freeze(ParamsEnums);

export { EmbedVerificationStatus, ParamsEnums };
