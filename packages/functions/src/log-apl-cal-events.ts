import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import axios from "axios";
import * as ical from "node-ical";
import AppleSignIn from "apple-signin-auth";

const client = new DynamoDBClient({});
const dynamoDB = DynamoDBDocumentClient.from(client);

// const dynamoDB = new DynamoDB.DocumentClient();

interface AppleCalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  location?: string;
  description?: string;
}

interface AppleAuthConfig {
    clientId: string;
    teamId: string;
    keyId: string;
    privateKey: string
    redirectUri: string;
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    // Apple Calendar API credentials
    const APPLE_ID = process.env.APPLE_ID;
    const APPLE_PASSWORD = process.env.APPLE_PASSWORD;
    
    // You'll need to implement proper Apple authentication
    // This is a simplified example - you should use proper OAuth flow
    const authToken = await getAppleAuthToken(APPLE_ID!, APPLE_PASSWORD!);
    
    // Fetch calendar events
    const events = await fetchAppleCalendarEvents(authToken);
    
    // Store events in DynamoDB
    await Promise.all(
      events.map((calendarEvent) => 
        dynamoDB.send(new PutCommand({
          TableName: process.env.CALENDAR_TABLE_NAME!,
          Item: {
            id: calendarEvent.id,
            title: calendarEvent.title,
            startDate: calendarEvent.startDate,
            endDate: calendarEvent.endDate,
            location: calendarEvent.location,
            description: calendarEvent.description,
            createdAt: new Date().toISOString(),
          },
        }))
      )
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Successfully stored ${events.length} calendar events`,
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error processing calendar events',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

async function getAppleAuthToken(appleId: string, password: string): Promise<string> {
    try {
        const config: AppleAuthConfig = {
          clientId: process.env.APPLE_CLIENT_ID!,
          teamId: process.env.APPLE_TEAM_ID!,
          keyId: process.env.APPLE_KEY_ID!,
          privateKey: process.env.APPLE_PRIVATE_KEY!,
          redirectUri: process.env.APPLE_REDIRECT_URI!
        };
    
        const client = AppleSignIn;
        // Get the authorization URL
        const authUrl = client.getAuthorizationUrl({
          clientID: config.clientId,
          redirectUri: config.redirectUri,
          scope: 'email calendar',
          state: 'state',
        });
    
        // In a real implementation, you would redirect the user to authUrl
        // and handle the callback with the authorization code
        // For this example, we'll assume we already have the authorization code
    
        // Exchange the authorization code for tokens
        const tokens = await client.getAuthorizationToken(process.env.APPLE_AUTH_CODE!, {
          clientID: config.clientId,
          redirectUri: config.redirectUri,
          clientSecret: config.privateKey
        });
    
        return tokens.access_token;
      } catch (error) {
        console.error('Apple authentication error:', error);
        throw new Error('Failed to authenticate with Apple');
      }
}

async function fetchAppleCalendarEvents(authToken: string): Promise<AppleCalendarEvent[]> {
  // Implement actual calendar API calls
  // You'll need to use Apple's Calendar API endpoints
  throw new Error('Calendar fetch not implemented');
}