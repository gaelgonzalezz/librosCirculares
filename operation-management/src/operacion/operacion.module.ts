import { Module } from '@nestjs/common';
import { OperacionController } from './operacion.controller';
import { OperacionService } from './operacion.service';
import { CopyManagementClient } from './clients/copy-management.client';
import { UserManagementClient } from './clients/user-management.client';

@Module({
  controllers: [OperacionController],
  providers: [OperacionService, CopyManagementClient, UserManagementClient],
})
export class OperacionModule {}
