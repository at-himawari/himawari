import * as path from "node:path";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class EngagementApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const frontendOrigin = new cdk.CfnParameter(this, "FrontendOrigin", {
      type: "String",
      default: "http://localhost:3000",
      description: "Allowed browser origin for the blog frontend.",
    });

    const commentAutoPublish = new cdk.CfnParameter(this, "CommentAutoPublish", {
      type: "String",
      default: "true",
      allowedValues: ["true", "false"],
      description: "Whether newly submitted comments become visible immediately.",
    });

    const googleClientId = new cdk.CfnParameter(this, "GoogleClientId", {
      type: "String",
      description: "Google OAuth 2.0 web client ID for Sign in with Google.",
      noEcho: true,
    });

    const openAiApiKey = new cdk.CfnParameter(this, "OpenAiApiKey", {
      type: "String",
      description: "OpenAI API key passed to the Lambda environment.",
      noEcho: true,
    });

    const engagementTable = new dynamodb.Table(this, "EngagementTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "PK",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "SK",
        type: dynamodb.AttributeType.STRING,
      },
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const engagementFunction = new lambda.Function(this, "EngagementFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "app.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "..", "src")),
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      environment: {
        TABLE_NAME: engagementTable.tableName,
        FRONTEND_ORIGIN: frontendOrigin.valueAsString,
        COMMENT_AUTO_PUBLISH: commentAutoPublish.valueAsString,
        OPENAI_API_KEY: openAiApiKey.valueAsString,
        GOOGLE_CLIENT_ID: googleClientId.valueAsString,
      },
    });

    engagementTable.grantReadWriteData(engagementFunction);

    const httpApi = new apigwv2.HttpApi(this, "EngagementHttpApi", {
      corsPreflight: {
        allowOrigins: [frontendOrigin.valueAsString],
        allowMethods: [
          apigwv2.CorsHttpMethod.GET,
          apigwv2.CorsHttpMethod.POST,
          apigwv2.CorsHttpMethod.DELETE,
          apigwv2.CorsHttpMethod.OPTIONS,
        ],
        allowHeaders: ["authorization", "content-type"],
        allowCredentials: true,
        maxAge: cdk.Duration.days(1),
      },
    });

    const integration = new HttpLambdaIntegration(
      "EngagementLambdaIntegration",
      engagementFunction,
    );

    httpApi.addRoutes({
      path: "/health",
      methods: [apigwv2.HttpMethod.GET],
      integration,
    });

    httpApi.addRoutes({
      path: "/articles/{slug}/engagement",
      methods: [apigwv2.HttpMethod.GET],
      integration,
    });

    httpApi.addRoutes({
      path: "/articles/{slug}/likes",
      methods: [apigwv2.HttpMethod.POST, apigwv2.HttpMethod.DELETE],
      integration,
    });

    httpApi.addRoutes({
      path: "/articles/{slug}/comments",
      methods: [apigwv2.HttpMethod.POST],
      integration,
    });

    httpApi.addRoutes({
      path: "/articles/{slug}/comments/{commentId}",
      methods: [apigwv2.HttpMethod.DELETE],
      integration,
    });

    new cdk.CfnOutput(this, "EngagementApiUrl", {
      description: "Base URL for the engagement HTTP API.",
      value: httpApi.apiEndpoint,
    });

    new cdk.CfnOutput(this, "EngagementTableName", {
      description: "DynamoDB table that stores likes and comments.",
      value: engagementTable.tableName,
    });
  }
}
