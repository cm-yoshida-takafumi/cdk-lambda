import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import apigateway = require('@aws-cdk/aws-apigateway');
import { Duration } from '@aws-cdk/core';
import * as ziputil from './zip-util';

export class CdkSampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const ddb = new dynamodb.Table(this, 'items', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      }
    });



    ziputil.createLayer()
    const layer = new lambda.LayerVersion(this, 'layer', {
      code: lambda.Code.fromAsset('./temp/test.zip'),
      compatibleRuntimes: [lambda.Runtime.NODEJS_10_X]
    })

    const createFunction = new lambda.Function(this, 'itemsCreate', {
      code: lambda.Code.fromAsset('src'),
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'create.handler',
      timeout: Duration.seconds(10),
      environment: {
        TABLE_NAME: ddb.tableName
      },
      layers: [ layer ]
    });
    ddb.grantReadWriteData(createFunction);

    // GET /items
    const indexFunction = new lambda.Function(this, 'itemsIndex', {
      code: lambda.Code.fromAsset('src'),
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler',
      timeout: Duration.seconds(10),
      environment: {
        TABLE_NAME: ddb.tableName
      }
    });
    ddb.grantReadData(indexFunction);


    const api = new apigateway.RestApi(this, 'RestApi', {})
    const resource = api.root.addResource("items")

    const createIntegration = new apigateway.LambdaIntegration(createFunction, {
      proxy: false,
      passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_MATCH,
      requestTemplates: {
        'application/json': '$input.json("$")'
      },
      integrationResponses: [
        {
          statusCode: "200",
          responseTemplates: {
            'application/json': '$input.json("$")'
          }
        }
      ]
    })

    resource.addMethod('POST', createIntegration, {
      methodResponses: [
        { statusCode: "200" }
      ]
    })

    const indexIntegration = new apigateway.LambdaIntegration(indexFunction, {
      proxy: false,
      passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_MATCH,
      requestTemplates: {
        'application/json': '$input.json("$")'
      },
      integrationResponses: [
        {
          statusCode: "200",
          responseTemplates: {
            'application/json': '$input.json("$")'
          }
        }
      ]
    })

    resource.addMethod('GET', indexIntegration, {
      methodResponses: [
        { statusCode: "200" }
      ]
    })
  }
}
