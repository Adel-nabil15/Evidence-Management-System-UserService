import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { TokenTypeStatic } from 'src/common/decorator';
import { TokenService } from 'src/common/service/token.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private _tokenService: TokenService,
    private _reflector: Reflector
  ) { }


  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const TypeToken = this._reflector.get<string>(TokenTypeStatic, context.getHandler())
    let req: Request = {} as Request
    let authorization = ""
    if (context.getType() === "http") {
      req = context.switchToHttp().getRequest() as Request;
      authorization = req.headers.authorization!
    }
    // else if (context.getType() === "ws") {
    // } else if (context.getType() === "rpc") {
    // }    
    try {
      const { decoded, user } = await this._tokenService.TokenSigneture(authorization!, TypeToken)
      req["decoded"] = decoded
      req["user"] = user
      return true
    }
    catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }
}
