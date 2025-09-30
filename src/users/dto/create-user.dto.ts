import { IsString, IsArray, ArrayNotEmpty, MaxLength, IsIn } from 'class-validator';
import { roles, groups } from 'src/mock_data/data';
export class CreateUserDto{
  @IsString()
  @MaxLength(100)
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsIn(roles, { each: true })
  roles: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsIn(groups, { each: true })
  groups: string[];
}