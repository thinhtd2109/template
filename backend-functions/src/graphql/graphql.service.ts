import { BadRequestException, Injectable } from '@nestjs/common';

const { execute } = require('apollo-link');
const { WebSocketLink } = require('apollo-link-ws');
const { SubscriptionClient } = require('subscriptions-transport-ws');
const ws = require('ws');
const gql = require('graphql-tag');

import { createClient } from 'graphqurl';

let webSocketClient = null;

const GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"
const secret = "secret"

const getWsClient = function (wsurl) {
  webSocketClient = new SubscriptionClient(
    wsurl,
    {
      connectionParams: {
        headers: {
          'x-hasura-admin-secret': secret
        },
      },
      reconnect: true,
    },
    ws,
  );
  return webSocketClient;
};


const createSubscriptionObservable = (wsurl, query, variables) => {
    const link = new WebSocketLink(getWsClient(wsurl));
    return execute(link, { query: query, variables: variables });
};
  
@Injectable()
export class GraphqlService {
    public client: any;
    public clientWss: any;
    constructor() {
        this.client = createClient({
        endpoint: GRAPHQL_ENDPOINT,
        headers: {
            'x-hasura-admin-secret': secret
        },
        });
    }

    static async query(payload): Promise<any> {
        const client = createClient({
        endpoint: GRAPHQL_ENDPOINT,
          headers: {
            'x-hasura-admin-secret': secret
          },
        });
        var res = await client.query(payload) as any;
        
        if (res.errors) {
            throw new BadRequestException(res.errors)
        }
        return res;
      }

  async query(payload): Promise<any> {
    var res = await this.client.query(payload);
    if (res.errors) {
        throw new BadRequestException(res.errors)
    }
    return res;
  }

  

  subscribe(query, variables, eventCallback, errorCallback) {
    const subscriptionClient = createSubscriptionObservable(
      GRAPHQL_ENDPOINT.indexOf('https://') > -1
        ? GRAPHQL_ENDPOINT.replace('https://', 'wss://')
        : GRAPHQL_ENDPOINT.replace('http://', 'ws://'), // GraphQL endpoint
      gql`
        ${query}
      `, // Subscription query
      variables, // Query variables
    );
    subscriptionClient.subscribe(
      (data) => eventCallback(data, webSocketClient),
      (error) => errorCallback(error, webSocketClient),
    );
  }




}
