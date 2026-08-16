import { Body, Controller, Post } from '@nestjs/common';
import { IsUUID } from 'class-validator';
import { ComplianceService } from './compliance.service';

class CheckRosterDto {
  @IsUUID()
  trainerId: string;

  @IsUUID()
  ruleId: string;
}

@Controller('compliance')
export class ComplianceController {
  constructor(private readonly service: ComplianceService) {}

  @Post('check')
  check(@Body() dto: CheckRosterDto) {
    return this.service.checkRoster(dto.trainerId, dto.ruleId);
  }
}
