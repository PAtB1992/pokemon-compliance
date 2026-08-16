import { Controller, Get, Param } from '@nestjs/common';
import { ViolationsService } from './violations.service';

@Controller('violations')
export class ViolationsController {
  constructor(private readonly service: ViolationsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('trainer/:trainerId')
  findByTrainer(@Param('trainerId') trainerId: string) {
    return this.service.findByTrainer(trainerId);
  }
}
