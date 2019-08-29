import dynamodb = require('aws-sdk');

export async function handler(event: any) {
    const client = new dynamodb.DynamoDB.DocumentClient();
    const items = await client.scan({
        TableName: process.env.TABLE_NAME!,
        Limit: 10
    }).promise()

    return {
        items: items['Items']
    }
}