import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import dynamodb = require('@aws-cdk/aws-dynamodb');

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

    const fn = new lambda.Function(this, 'HelloLambda', {
      functionName: 'HelloLambdaTest',
      code: lambda.Code.fromAsset('src'),
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler',
      environment: {
        TABLE_NAME: ddb.tableName
      }
    });

    ddb.grantReadWriteData(fn);

  }
}
