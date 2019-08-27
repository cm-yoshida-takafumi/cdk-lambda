import dynamodb = require('aws-sdk');

export async function handler(event: any): Promise<any> {
    console.log("lambda start!!!");
    console.log(event);

    const client = new dynamodb.DynamoDB.DocumentClient();
    const item = event
    item['id'] = '11111'

    const params = {
        TableName: process.env.TABLE_NAME!,
        Item: item
    }

    await client.put(params).promise()

    return {
        statusCode: 200,
        body: 'hello'
    };
}