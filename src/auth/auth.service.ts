import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto, SigninUserDto } from "../users/dto";
import { UsersService } from "../users/users.service";
import { Response } from "express";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { MailService } from "../mail/mail.service";
import { User } from "../../generated/prisma";

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService
  ) {}

  async generateToken(user: User) {
    const payload = { id: user.id, email: user.email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCES_TOKEN_KEY,
        expiresIn: process.env.ACCES_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async signup(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException("This user already exists");
    }

    // Generate activation link (UUID)
    const activationLink = uuidv4();

    const newUser = await this.usersService.create({
      ...createUserDto,
      activation_link: activationLink,
    });

    // (Optional) Send activation email here
    await this.mailService.sendMail(newUser);

    return {
      message: "New user added. Please check your email for activation link.",
      userId: newUser.id,
      activationLink, // return for testing, in production remove this
    };
  }

  async signin(signinUserDto: SigninUserDto, res: Response) {
    const { email, password } = signinUserDto;
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isMatched = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatched) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const { accessToken, refreshToken } = await this.generateToken(user);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { hashedRefreshToken },
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: +process.env.COOKIE_TIME!,
      httpOnly: true,
    });

    return { userId: user.id, accessToken };
  }

  async signout(refreshToken: string, res: Response) {
    res.clearCookie("refreshToken");
    return { message: "User signed out" };
  }

  async refreshToken(
    userId: number,
    refreshTokenFromCookie: string,
    res: Response
  ) {
    const decodedToken: any = this.jwtService.decode(refreshTokenFromCookie);
    if (!decodedToken || decodedToken.id !== userId) {
      throw new ForbiddenException("Not allowed");
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user || !user.hashedRefreshToken) {
      throw new NotFoundException("User not found or refresh token missing");
    }

    const tokenMatch = await bcrypt.compare(
      refreshTokenFromCookie,
      user.hashedRefreshToken
    );
    if (!tokenMatch) throw new ForbiddenException("Forbidden");

    const { accessToken, refreshToken } = await this.generateToken(user);
    const newHashedRefreshToken = await bcrypt.hash(refreshToken, 7);

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { hashedRefreshToken: newHashedRefreshToken },
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });

    return { message: "Token refreshed", userId: user.id, accessToken };
  }
}
