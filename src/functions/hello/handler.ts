import { PrismaClient } from ".prisma/client"
import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway"
import { middyfy } from "@libs/lambda"
import schema from "./schema"

const prisma = new PrismaClient()

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const { email } = event.body;
    const user = await prisma.user.findFirst({ where: { email } })

    return formatJSONResponse({
      message: `Hello World Serverless - ${user.name}`,
    })
  } catch (error: any) {
    console.log(error.message);

    return formatJSONResponse({
      message: 'erro',
    })
  }
}

export const main = middyfy(hello)