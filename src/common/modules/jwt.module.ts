import type { JwtModuleAsyncOptions } from "@nestjs/jwt";

import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { DIMIConfigModule } from "./config.module";

export const JWTOptions: JwtModuleAsyncOptions = {
  imports: [DIMIConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    signOptions: {
      algorithm: "RS256",
    },
    publicKey: configService.get<string>("JWT_PUBLIC"),
    privateKey: configService.get<string>("JWT_PRIVATE"),
    secretOrPrivateKey: configService.get<string>("JWT_PRIVATE"),
    global: true,
  }),
};

@Module({
  imports: [JwtModule.registerAsync(JWTOptions)],
  exports: [JwtModule],
})
export class DIMIJWTModule {}
