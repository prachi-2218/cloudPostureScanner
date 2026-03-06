const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { dynamoClient } = require("../awsConfig");
const { v4: uuidv4 } = require("uuid");

const docClient = DynamoDBDocumentClient.from(dynamoClient);

const tableName = process.env.DYNAMODB_TABLE;

async function storeResults(results) {
  console.log("Storage service: Starting to store results...");
  try {
    const id = uuidv4();
    console.log(`Storage service: Generated UUID: ${id}`);

    console.log("Storage service: Sending to DynamoDB...");
    await docClient.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          id,
          results,
          timestamp: new Date().toISOString()
        }
      })
    );

    console.log(`Storage service: Results stored successfully with ID: ${id}`);
    return id;
  } catch (error) {
    console.error("Storage service: Error storing results in DynamoDB:", error.message);
    console.error("Storage service: Error details:", error);
    
    
    if (error.name === 'ResourceNotFoundException') {
      throw new Error(`DynamoDB table '${tableName}' not found. Please create the table first.`);
    } else if (error.name === 'AccessDeniedException') {
      throw new Error("Access denied to DynamoDB. Check IAM permissions for DynamoDB operations.");
    } else {
      throw new Error(`Failed to store results: ${error.message}`);
    }
  }
}

module.exports = { storeResults };
