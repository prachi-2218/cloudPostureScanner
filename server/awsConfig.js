const { EC2Client } = require("@aws-sdk/client-ec2");
const { S3Client } = require("@aws-sdk/client-s3");
const { IAMClient } = require("@aws-sdk/client-iam");
const { CloudTrailClient } = require("@aws-sdk/client-cloudtrail");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const REGION = process.env.AWS_REGION;

// Validate environment variables
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
  console.error("Missing AWS credentials. Please check your .env file.");
  process.exit(1);
}

// AWS credentials configuration
const clientConfig = {
  region: REGION
};

// Only add credentials if they're not already available via environment
if (accessKeyId && secretAccessKey) {
  clientConfig.credentials = {
    accessKeyId: accessKeyId.trim(),
    secretAccessKey: secretAccessKey.trim()
  };
}

const ec2Client = new EC2Client(clientConfig);
const s3Client = new S3Client(clientConfig);
const iamClient = new IAMClient(clientConfig);
const cloudTrailClient = new CloudTrailClient(clientConfig);
const dynamoClient = new DynamoDBClient(clientConfig);

module.exports = {
  ec2Client,
  s3Client,
  iamClient,
  cloudTrailClient,
  dynamoClient
};