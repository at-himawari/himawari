#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { EngagementApiStack } from "../lib/engagement-api-stack";

const app = new cdk.App();

new EngagementApiStack(app, "HimawariEngagementApiStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
