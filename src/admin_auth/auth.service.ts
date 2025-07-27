import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { CreateAdminDto } from "../admin/dto/create-admin.dto";
import { AdminService } from "../admin/admin.service";
import { SigninAdminDto } from "../admin/dto/signin-admin.dto";
import * as bcrypt from "bcrypt";
import { Admin } from "../../generated/prisma";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService
  ) {}

  async generateToken(admin: Admin) {
    const payload = {
      id: admin.id,
      email: admin.email,
      is_creator: admin.is_creator,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ADMIN_ACCES_TOKEN_KEY,
        expiresIn: process.env.ADMIN_ACCES_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.ADMIN_REFRESH_TOKEN_KEY,
        expiresIn: process.env.ADMIN_REFRESH_TOKEN_TIME,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(createAdminDto: CreateAdminDto) {
    // 🔧 FIXED: check by email before creating new admin
    const admin = await this.adminService.findUserByEmail(createAdminDto.email);
    if (admin) {
      throw new ConflictException("This admin already exists");
    }

    // 🔧 ENCRYPT PASSWORD BEFORE SAVING
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
    const newUser = await this.adminService.create({
      ...createAdminDto,
      password: hashedPassword,
    });

    return { adminId: newUser.id }; // 🔧 CHANGED: from _id to id
  }

  async login(loginAdminDto: SigninAdminDto, res: Response) {
    const admin = await this.adminService.findUserByEmail(loginAdminDto.email);

    if (!admin) {
      throw new UnauthorizedException("Email yoki parol noto'g'ri"); // Uzbek: Email or password is incorrect
    }

    const isMatched = await bcrypt.compare(
      loginAdminDto.password,
      admin.password
    );

    if (!isMatched) {
      throw new UnauthorizedException("Email yoki parol noto'g'ri");
    }

    const { accessToken, refreshToken } = await this.generateToken(admin);

    // 🔧 Save hashed refresh token in DB
    const hashedToken = await bcrypt.hash(refreshToken, 7);
    admin.refresh_token = hashedToken;
    await this.adminService.update(admin.id, { refresh_token: hashedToken }); // 🔧 Better to use service update

    res.cookie("refreshToken", refreshToken, {
      maxAge: +process.env.COOKIE_TIME!,
      httpOnly: true,
      secure: true,
      sameSite: "strict", 
    });

    return { adminId: admin.id, accessToken };
  }

  async signout(refreshToken: string, res: Response) {
    res.clearCookie("refreshToken");
    return { message: "Admin signed out" };
  }

  async refreshToken(id: string, refreshToken: string, res: Response) {
    // 🔧 Use findOneBy for ID search
    const admin = await this.adminService.findById(+id);

    if (!admin || !admin.refresh_token) {
      throw new UnauthorizedException("Admin not found or no refresh token");
    }

    const isMatch = await bcrypt.compare(refreshToken, admin.refresh_token);
    if (!isMatch) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const tokens = await this.generateToken(admin);
    const hashedToken = await bcrypt.hash(tokens.refreshToken, 7);
    admin.refresh_token = hashedToken;
    await this.adminService.update(admin.id, { refresh_token: hashedToken });

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: +process.env.COOKIE_TIME!,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return { adminId: admin.id, accessToken: tokens.accessToken };
  }
}
