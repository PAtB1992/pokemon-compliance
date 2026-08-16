import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Violation } from './violation.entity';
import { ViolationsController } from './violations.controller';
import { ViolationsService } from './violations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Violation])],
  controllers: [ViolationsController],
  providers: [ViolationsService],
  exports: [ViolationsService],
})
export class ViolationsModule {}
