import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export const POSTGRES_MAX_BIGINT = 9_223_372_036_854_775_807;

export enum CommentStatus {
    PENDING = "pending",
    OK = "ok",
    REJECTED = "rejected"
}
  
export class CreateCommentDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(POSTGRES_MAX_BIGINT)
//    @Transform(val => BigInt(val.value))
    id: number;

    @IsOptional()
    @IsNumber()
    galleryId: number

    @IsOptional()
    @IsNumber()
    tubeId: number

    @IsString()
    text: string;

    @IsString()
    userEmail: string;

    @IsString() 
    userName: string;

    @IsOptional()
    @Transform(({ value }) => new Date(value))
    date: Date;

    @IsOptional()
    @IsNumber()
    likes: number;

    @IsOptional()
    @IsNumber()
    dislikes: number;

    @IsOptional()
    status: CommentStatus;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(POSTGRES_MAX_BIGINT)
    parentId: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(POSTGRES_MAX_BIGINT)
    replyForId: number;
  }