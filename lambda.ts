import * as lambda from "aws-lambda";
import awsServerlessExpress from "aws-serverless-express";
import { app } from "./src";

const server = awsServerlessExpress.createServer(app);

export const handler = (
  event: lambda.APIGatewayProxyEvent,
  context: lambda.Context,
) => awsServerlessExpress.proxy(server, event, context);
