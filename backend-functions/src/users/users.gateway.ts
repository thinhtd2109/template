import { Injectable } from '@nestjs/common';
import { GraphqlService } from 'src/graphql/graphql.service';

@Injectable()
export class UserGateway {
  constructor(private requestService: GraphqlService) {}
  async findUserByEmail(email: string) {
    const res = await this.requestService.query({
      query: `
                query($email: String) {
                    result: users(where:{ email: { _eq: $email } }) {
                        id 
                        email
                        password
                        hash_refresh_token
                    }
                }
            `,
      variables: {
        email,
      },
    });

    return res.data.result;
  }
}
