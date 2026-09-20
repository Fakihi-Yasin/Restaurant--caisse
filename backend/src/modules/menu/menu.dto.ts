import { IsString, IsOptional, IsInt, IsBoolean, IsEnum, IsUUID, Min, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Station } from '@prisma/client';

export class CreateCategoryDto {
  @ApiProperty() @IsString() nameFr: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nameAr?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() sortOrder?: number;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() nameFr?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nameAr?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() sortOrder?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() active?: boolean;
}

export class CreateProductDto {
  @ApiProperty() @IsUUID() categoryId: string;
  @ApiProperty() @IsString() nameFr: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nameAr?: string;
  @ApiProperty() @IsInt() @Min(0) priceCents: number;
  @ApiPropertyOptional() @IsOptional() @IsString() imageUrl?: string;
  @ApiPropertyOptional({ enum: Station }) @IsOptional() @IsEnum(Station) station?: Station;
  @ApiPropertyOptional() @IsOptional() @IsInt() sortOrder?: number;
}

export class UpdateProductDto {
  @ApiPropertyOptional() @IsOptional() @IsUUID() categoryId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nameFr?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nameAr?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) priceCents?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() imageUrl?: string;
  @ApiPropertyOptional({ enum: Station }) @IsOptional() @IsEnum(Station) station?: Station;
  @ApiPropertyOptional() @IsOptional() @IsInt() sortOrder?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() available?: boolean;
}

export class UpdateAvailabilityDto {
  @ApiProperty() @IsBoolean() available: boolean;
}

export class CreateModifierDto {
  @ApiProperty() @IsString() nameFr: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nameAr?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() priceDeltaCents?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() sortOrder?: number;
}

export class CreateModifierGroupDto {
  @ApiProperty() @IsString() nameFr: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nameAr?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() required?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() multiple?: boolean;
  @ApiPropertyOptional({ type: [CreateModifierDto] })
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => CreateModifierDto)
  modifiers?: CreateModifierDto[];
}

export class UpdateModifierGroupDto {
  @ApiPropertyOptional() @IsOptional() @IsString() nameFr?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nameAr?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() required?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() multiple?: boolean;
}
