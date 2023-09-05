import { Injectable } from '@nestjs/common';
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
@Injectable()
export class AppService {
  async getHello() {
   
    return 'Hello world'
  }
}
