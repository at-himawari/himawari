import * as path from "node:path";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigw from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sources from "aws-cdk-lib/aws-lambda-event-sources";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subscriptions from "aws-cdk-lib/aws-sns-subscriptions";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as logs from "aws-cdk-lib/aws-logs";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";

/** 投稿受付と非公開データの保存、通知再試行を構成する。 */
export class SubmissionsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const origin = new cdk.CfnParameter(this, "FrontendOrigin", { type: "String", allowedPattern: "https://[^/]+", description: "Exact HTTPS frontend origin without trailing slash." });
    const siteKey = new cdk.CfnParameter(this, "HcaptchaSiteKey", { type: "String", minLength: 1 });
    const secret = new cdk.CfnParameter(this, "HcaptchaSecret", { type: "String", minLength: 1, noEcho: true });
    const to = new cdk.CfnParameter(this, "NotificationTo", { type: "String", allowedPattern: "[^\\s@]+@[^\\s@]+\\.[^\\s@]+" });
    const topic = new sns.Topic(this, "SubmissionNotifications", { displayName: "Himawari Project", enforceSSL: true });
    topic.addSubscription(new subscriptions.EmailSubscription(to.valueAsString));
    const table = new dynamodb.Table(this, "Submissions", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      stream: dynamodb.StreamViewType.KEYS_ONLY,
      timeToLiveAttribute: "ttl",
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: true },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
    const failures = new sqs.Queue(this, "NotificationFailures", { encryption: sqs.QueueEncryption.SQS_MANAGED, retentionPeriod: cdk.Duration.days(14) });
    const code = lambda.Code.fromAsset(path.join(__dirname, "..", "submissions"), { exclude: ["*.node-test.js"] });
    const receiver = new lambda.Function(this, "Receiver", {
      runtime: lambda.Runtime.NODEJS_22_X, code, handler: "app.handler", timeout: cdk.Duration.seconds(15), memorySize: 256,
      logGroup: new logs.LogGroup(this, "ReceiverLogs", { retention: logs.RetentionDays.ONE_MONTH }),
      environment: { TABLE_NAME: table.tableName, FRONTEND_ORIGIN: origin.valueAsString, HCAPTCHA_SECRET: secret.valueAsString, HCAPTCHA_SITE_KEY: siteKey.valueAsString },
    });
    table.grantWriteData(receiver);
    const notifier = new lambda.Function(this, "Notifier", {
      runtime: lambda.Runtime.NODEJS_22_X, code, handler: "app.notify", timeout: cdk.Duration.seconds(30), memorySize: 256,
      logGroup: new logs.LogGroup(this, "NotifierLogs", { retention: logs.RetentionDays.ONE_MONTH }),
      environment: { TABLE_NAME: table.tableName, NOTIFICATION_TOPIC_ARN: topic.topicArn },
    });
    table.grantReadWriteData(notifier);
    topic.grantPublish(notifier);
    notifier.addEventSource(new sources.DynamoEventSource(table, {
      startingPosition: lambda.StartingPosition.TRIM_HORIZON, batchSize: 10, reportBatchItemFailures: true,
      retryAttempts: 10, maxRecordAge: cdk.Duration.hours(23), bisectBatchOnError: true,
      onFailure: new sources.SqsDlq(failures),
      filters: [lambda.FilterCriteria.filter({ eventName: lambda.FilterRule.isEqual("INSERT") })],
    }));
    new cloudwatch.Alarm(this, "NotificationFailureAlarm", { metric: failures.metricApproximateNumberOfMessagesVisible(), threshold: 1, evaluationPeriods: 1, alarmDescription: "Submission email failed. Inspect the failure queue and pending DynamoDB records; republish after fixing SNS." });
    const api = new apigw.HttpApi(this, "Api", { corsPreflight: { allowOrigins: [origin.valueAsString], allowMethods: [apigw.CorsHttpMethod.POST], allowHeaders: ["content-type"] } });
    api.addRoutes({ path: "/submissions", methods: [apigw.HttpMethod.POST], integration: new HttpLambdaIntegration("ReceiverIntegration", receiver) });
    const stage = api.defaultStage?.node.defaultChild as apigw.CfnStage;
    stage.defaultRouteSettings = { throttlingBurstLimit: 10, throttlingRateLimit: 5 };
    new cdk.CfnOutput(this, "NotificationTopicArn", { value: topic.topicArn });
    new cdk.CfnOutput(this, "SubmissionApiUrl", { value: api.apiEndpoint });
    new cdk.CfnOutput(this, "SubmissionTableName", { value: table.tableName });
    new cdk.CfnOutput(this, "NotificationFailureQueueUrl", { value: failures.queueUrl });
  }
}
