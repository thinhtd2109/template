import { Injectable } from '@nestjs/common';
import { GraphqlService } from 'src/graphql/graphql.service';
import { SignUpDto } from './dtos/SignUp.dto';
import { UpdateInputDto } from './dtos/User.dto';

@Injectable()
export class AuthGateWay {
  constructor(private requestService: GraphqlService) {}
  async getUsers() {
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
    return res.data.results;
  }
  async createUser(input: SignUpDto) {
    const res = await this.requestService.query({
      query: `
        mutation ($email: String, $password:String) {
            result: insert_users_one(object: { email: $email, password: $password }) {
              id 
              email
              password
            }
          }
        `,
      variables: {
        email: input.email,
        password: input.password,
      },
    });
    return res;
  }
  async updateUser(id: string, inputData: unknown) {
    const res = await this.requestService.query({
      query: `
            mutation updateUser($data: users_set_input, $where: users_bool_exp!) {
                result: update_users(where: $where, _set: $data) {
                    affected_rows
                }
            }
        `,
      variables: {
        where: {
          id: { _eq: id },
        },
        data: inputData,
      },
    });
    return res;
  }
}
