import type { AWS } from '@serverless/typescript'

import hello from '@functions/hello'

const patterns = [
  'node_modules/.prisma/client/schema.prisma',
  '!node_modules/.prisma/client/libquery_engine-*',
  'node_modules/.prisma/client/libquery_engine-debian-*',
  'node_modules/.prisma/client/libquery_engine-rhel-*',
  '!node_modules/prisma/libquery_engine-*',
  '!node_modules/@prisma/engines/**',
]

const serverlessConfiguration: AWS = {
  useDotenv: true,
  service: 'ignitecertificate',
  frameworkVersion: '2',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dotenv-plugin'],
  provider: {
    stage: 'dev',
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: {
    hello
  },
  package: {
    individually: true,
    patterns: [...patterns]
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10
    }
  }
}

module.exports = serverlessConfiguration