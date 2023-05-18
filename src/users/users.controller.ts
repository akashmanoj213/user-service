import { Controller, Get, Post, Body, Param, Delete, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateOrUpdateUserDto } from './dto/create-update-user.dto';
import { PubSubEvent } from './dto/pub-sub-event.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('event-handler')
  async userChangeEventHandler(@Body() event: PubSubEvent) {
    console.log("event", event);
    const { message: { data } } = event;
    const createOrUpdateUserDto: CreateOrUpdateUserDto = this.formatMessageData(data);
    console.log("DTO", createOrUpdateUserDto);

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
      console.log("Error", error.message);
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

  formatMessageData(data: string): CreateOrUpdateUserDto {
    const bufferObj = Buffer.from(data, "base64");
    const decodedData = bufferObj.toString("utf8");
    const jsonObj = JSON.parse(decodedData);

    return jsonObj;
  }
}
