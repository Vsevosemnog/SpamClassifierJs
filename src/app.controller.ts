import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateCommentDto } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('train')
  async trainModel() {
    return await this.appService.trainModel();
  }

  @Post()
  async createComment(
    @Body() comment: CreateCommentDto,): Promise<string> {
    return await this.appService.createComment(comment);
  }
}
