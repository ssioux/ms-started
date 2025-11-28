import { Delete, Get, Param, Patch, Req } from '@nestjs/common';
import { BasicService } from './basic.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import * as _ from 'lodash';

export class BasicController {
 
  constructor(private service: BasicService) {}

  @Get()
  @ApiOperation({ summary: 'Returns an array of active entities' })
  @ApiResponse({ status: 200, description: 'Array of active entities' })
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'Returns one entity data' })
  @ApiResponse({ status: 200, description: 'Entity data' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(+id);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'Soft-delete the entity (setting current timestamp to deleted_at)' })
  @ApiResponse({ status: 200, description: 'Entity soft-removed' })
  @ApiResponse({ status: 404, description: 'Entity not found it, you cannot remove it' })
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }

  @Patch('restore/:id')
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'Restore the entity (setting null to deleted_at)' })
  @ApiResponse({ status: 200, description: 'Entity restored' })
  @ApiResponse({ status: 400, description: 'Entity already exist, you cannot restore it' })
  async restore(@Param('id') id: string) {
    return await this.service.restore(+id);
  }
}
