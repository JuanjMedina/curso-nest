import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UpdateUserDto, UserDto, UserToProjectDTO } from '../dto/user.dto';
import { UsersEntity } from '../entities/users.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PublicAccesss } from 'src/auth/decorators/public.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AdminAccess } from 'src/auth/decorators/admin.decorator';
import { ApiBearerAuth, ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @PublicAccesss()
  @Post('register')
  public async registerUser(@Body() body: UserDto): Promise<UsersEntity> {
    return await this.userService.createUser(body);
  }

  @Roles('ADMIN')
  @Get('all')
  public async getAllUser(): Promise<UsersEntity[]> {
    return await this.userService.findAll();
  }

  @ApiParam({ name: 'userId', required: true })
  @PublicAccesss()
  @Get('find/:userId')
  public async findUserById(@Param('userId') id: string): Promise<UsersEntity> {
    return await this.userService.findUserById(id);
  }

  @ApiParam({ name: 'userId', required: true })
  @Put('update/:userId')
  public async updateUser(
    @Body() body: UpdateUserDto,
    @Param('userId') id: string,
  ): Promise<UpdateResult | undefined> {
    return await this.userService.updateUser(body, id);
  }

  @ApiParam({ name: 'userId', required: true })
  @Delete('delete/:userId')
  public async deleteUser(@Param('userId') id: string): Promise<DeleteResult> {
    return await this.userService.deleteUser(id);
  }

  @Post('add-to-project')
  public async addToProject(@Body() body: UserToProjectDTO) {
    return await this.userService.addToProject(body);
  }
}
