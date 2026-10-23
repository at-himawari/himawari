#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { EngagementApiStack } from "../lib/engagement-api-stack";

import { SubmissionsStack } from "../lib/submissions-stack";

const app = new cdk.App();

new EngagementApiStack(app, "HimawariEngagementApiStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

new SubmissionsStack(app, "HimawariSubmissionsStack", {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
