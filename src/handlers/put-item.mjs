// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const tableName = process.env.SAMPLE_TABLE;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
export const putItemHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    // Get id and name from the body of the request
    const body = JSON.parse(event.body);
    const aleatorio = Math.floor(Math.random() * 100000);
    const titulo = body.titulo;
    const año = body.año;
    const edicion = body.edicion;
    const autor = body.autor;
    const genero = body.genero;
    const tipo = body.tipo;



    let controlPrecio;
    switch (tipo){
        case "TapaBlanda":
            precio="14,95 €";
            break;
        case "TapaDura":
            precio="19,95 €";
            break;
        case "Bolsillo":
            precio="12,50 €";
            break;
        case "Electronico":
            precio="10,99€";
            break;
        default:
            controlPrecio="Desconocido";
    }

    // Creates a new item, or replaces an old item with a new item
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property

    if (titulo < 2) {
        return {
            statusCode: 403,
            body: "El nombre introducido es muy corto"
        }
    }else{
    var params = {
        TableName : tableName,
        Item: { id : aleatorio.toString(), titulo : titulo, año : año, edicion : edicion, autor : autor, genero : genero, tipo : tipo, precio : precio }
    };

    try {
        const data = await ddbDocClient.send(new PutCommand(params));
        console.log("Success - item added or updated", data);
      } catch (err) {
        console.log("Error", err.stack);
      }

    const response = {
        statusCode: 200,
        body: JSON.stringify(body)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
    }
};
