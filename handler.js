
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const REGION = process.env.AWS_REGION || "us-east-1";
const TABLE = process.env.TABLE_NAME || "ServerlessItemsTable";

const ddbClient = new DynamoDBClient({ region: REGION });
const ddbDoc = DynamoDBDocumentClient.from(ddbClient);

exports.getItems = async (event) => {
  try {
    const result = await ddbDoc.send(new ScanCommand({ TableName: TABLE }));
    const items = result.Items || [];

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    };
  } catch (err) {
    console.error("Scan error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not fetch items" }),
    };
  }
};

exports.createItem = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    if (!body.text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing field: text" }),
      };
    }

    const item = {
      id: uuidv4(),
      text: body.text,
      createdAt: new Date().toISOString(),
    };

    await ddbDoc.send(
      new PutCommand
