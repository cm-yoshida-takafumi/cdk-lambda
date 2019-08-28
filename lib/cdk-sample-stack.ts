import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import dynamodb = require('@aws-cdk/aws-dynamodb');
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

    const fn = new lambda.Function(this, 'HelloLambda', {
      functionName: 'HelloLambdaTest',
      code: lambda.Code.fromAsset('src'),
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler',
      timeout: Duration.seconds(10),
      environment: {
        TABLE_NAME: ddb.tableName
      },
      layers: [ layer ]
    });

    ddb.grantReadWriteData(fn);

  }
}
