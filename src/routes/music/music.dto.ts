import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { IsNumber } from "nestjs-swagger-dto";

export class SearchDTO {
  @ApiProperty()
  @IsString()
  query: string;
}

class YouTubeSearchResultThumbnails {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsNumber()
  width: number;

  @ApiProperty()
  @IsNumber()
  height: number;
}

class YouTubeSearchResultThumbnailsList {
  @ApiProperty({ type: YouTubeSearchResultThumbnails })
  @IsString()
  default: YouTubeSearchResultThumbnails;

  @ApiProperty({ type: YouTubeSearchResultThumbnails })
  @IsNumber()
  medium: YouTubeSearchResultThumbnails;

  @ApiProperty({ type: YouTubeSearchResultThumbnails })
  @IsNumber()
  high: YouTubeSearchResultThumbnails;
}

export class YouTubeSearchResultsDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  link: string;

  @IsString()
  @ApiProperty()
  kind: string;

  @ApiProperty()
  @IsString()
  publishedAt: string;

  @ApiProperty()
  @IsString()
  channelTitle: string;

  @ApiProperty()
  @IsString()
  channelId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: YouTubeSearchResultThumbnailsList })
  thumbnails: YouTubeSearchResultThumbnailsList;
}
