import dynamodb = require('aws-sdk');
import uuid = require('uuid/v4');

export async function handler(event: any): Promise<any> {
    console.log("lambda start!!!");
    console.log(event);

    const client = new dynamodb.DynamoDB.DocumentClient();
    const item = event
    item['id'] = uuid()

    const params = {
        TableName: process.env.TABLE_NAME!,
        Item: item
    }

    await client.put(params).promise()

    return {
        statusCode: 200,
        body: {
            id: item['id']
        }
    };
}

export async function index(event: any) {
    const client = new dynamodb.DynamoDB.DocumentClient();
    const items = await client.scan({
        TableName: process.env.TABLE_NAME!,
        Limit: 10
    }).promise()

    return {
        items: items['Items']
    }
}