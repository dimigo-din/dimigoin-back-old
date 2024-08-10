// import {
//   Body,
//   Controller,
//   HttpStatus,
//   Post,
//   Request,
//   UseGuards,
// } from "@nestjs/common";
// import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
//
// import { DIMIJwtAuthGuard } from "../../auth/guards/auth.guard";
// import { DIMIStudentGuard } from "../../auth/guards/auth.guard.student";
//
// import { StayManageService } from "./stayManage.service";
//
// @ApiTags("Stay Manage")
// @Controller("/manage/stay")
// export class StayManageController {
//   constructor(private readonly laundryService: StayManageService) {}
//
//   // @ApiOperation({
//   //   summary: "기기 목록",
//   //   description: "세탁 기기목록을 불러옵니다.",
//   // })
//   // @ApiResponse({
//   //   status: HttpStatus.OK,
//   //   description: "기기 리스트",
//   //   type: [MachineListDTO],
//   // })
//   // @UseGuards(DIMIJwtAuthGuard, DIMIStudentGuard)
//   // @Post("/list")
//   // list(@Request() req) {
//   //   return this.laundryService.list(req.user);
//   // }
// }
