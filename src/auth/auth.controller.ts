import { Controller, Post, Body, Res, Param, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ParseIntPipe } from "@nestjs/common";
import { Response } from "express";
import { CreateUserDto, SigninUserDto } from "../users/dto";
import { CookieGetter } from "../common/decorators/cookie-getter.decorator";
import { GetCurrentUserId } from "../common/decorators";
import { RefreshTokenGuard } from "../common/guards";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("singup")
  async singup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post("singin")
  async singin(
    @Body() SigninUserDto: SigninUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signin(SigninUserDto, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Post("singout")
  signout(
    @GetCurrentUserId() userId: number,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signout(+userId, res);
  }

  @Post(":id/refresh")
  refresh(
    @Param("id", ParseIntPipe) id: number,
    @CookieGetter("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.refreshToken(id, refreshToken, res);
  }
}
