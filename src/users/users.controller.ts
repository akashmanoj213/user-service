import { Controller, Get, Post, Body, Param, Delete, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateOrUpdateUserDto } from './dto/create-update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('event-handler')
  async userChangeEventHandler(@Body() createOrUpdateUserDto: CreateOrUpdateUserDto) {
    const { id, mobileNumber } = createOrUpdateUserDto;

    let result: CreateOrUpdateUserDto;

    if (!id && !mobileNumber) {
      throw new BadRequestException("Cannot create user as mobileNumber is missing in request.");
    }

    try {
      if (id) {
        result = await this.usersService.update(id, createOrUpdateUserDto);
      } else {
        result = await this.usersService.create(createOrUpdateUserDto);
      }

      // Sync changes to Query database
      // TO DO: handle error and resync database.
      await this.usersService.syncQueryDatabase(result.id, result);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return result;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
