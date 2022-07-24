import { Injectable } from '@nestjs/common';
import { GraphqlService } from './graphql/graphql.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(
    private requestService: GraphqlService,
    private jwtService: JwtService,
  ) {}
  async getHello() {
    const res = await this.requestService.query({
      query: `
        query getUsers {
          results: users {
            id
            email
            password
          }
        }
      `,
    });
    console.log(res.data.results);
    return res.data.results;
  }
}
