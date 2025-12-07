import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { RoleStatic } from 'src/common/decorator';
import { TokenService } from 'src/common/service/token.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private _reflector: Reflector
  ) { }


  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const role_type = this._reflector.get<string>(RoleStatic, context.getHandler())
    let req: Request = {} as Request
    if (context.getType() === "http") {
      req = context.switchToHttp().getRequest() as Request;

    }
    // else if (context.getType() === "ws") {
    // } else if (context.getType() === "rpc") {
    // }    
    try {
      const user = req["user"]
      if (!role_type.includes(user.role)) throw new UnauthorizedException()
      return true
    }
    catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }
}
