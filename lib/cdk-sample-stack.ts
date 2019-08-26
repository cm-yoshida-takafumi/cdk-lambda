import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');

export class CdkSampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const fn = new lambda.Function(this, 'HelloLambda', {
      functionName: 'HelloLambda',
      code: lambda.Code.fromAsset('src'),
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler'
    });

  }
}
