import type { JwtModuleAsyncOptions } from "@nestjs/jwt";

import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { DIMIConfigModule } from "./config.module";

export const JWTOptions: JwtModuleAsyncOptions = {
  imports: [DIMIConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    console.log("JWTOptions");
    console.log("JWT_PUBLIC", configService.get<string>("JWT_PUBLIC"));
    console.log("JWT_PRIVATE", configService.get<string>("JWT_PRIVATE"));
    return {
      publicKey: configService.get<string>("JWT_PUBLIC"),
      privateKey: configService.get<string>("JWT_PRIVATE"),
      global: true,
      signOptions: {
        algorithm: "RS256",
      },
    };
  },
};

@Module({
  imports: [JwtModule.registerAsync(JWTOptions)],
  exports: [JwtModule],
})
export class DIMIJWTModule {}
