import { Resource } from "sst";
import { Handler } from "aws-lambda";
import { Example } from "@gibcal-sst-mono-1/core/example";

export const handler: Handler = async (_event) => {
  return {
    statusCode: 200,
    body: `${Example.hello()} Linked to ${Resource.Uploads.name}.`,
  };
};
