import dynamodb = require('aws-sdk');
import uuid = require('uuid/v4');

export async function handler(event: any): Promise<any> {
    const client = new dynamodb.DynamoDB.DocumentClient();
    const item = event
    item['id'] = uuid()

    const params = {
        TableName: process.env.TABLE_NAME!,
        Item: item
    }

    await client.put(params).promise()

    return {
        id: item['id']
    }
}