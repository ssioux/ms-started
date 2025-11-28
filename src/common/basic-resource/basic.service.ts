import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ERRORS } from '../error-handler/exception.enum';

export class BasicService {
  constructor(readonly repo: Repository<any>) {}

  async create(entity: any) {
    return await this.repo.save(this.repo.create(entity));
  }

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: number) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new HttpException(ERRORS.ERROR_MICROSERVICE_NAME_XXX, HttpStatus.NOT_FOUND);
    return entity;
  }

  async update(id: number, entity: any) {
    delete entity.active;

    const object = await this.repo.preload({ id: id, ...entity });
    if (!object) throw new HttpException(ERRORS.ERROR_MICROSERVICE_NAME_XXX, HttpStatus.NOT_FOUND);
    return await this.repo.save(object);
  }

  async remove(id: number) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new HttpException(ERRORS.ERROR_MICROSERVICE_NAME_XXX, HttpStatus.NOT_FOUND);
    return await this.repo.softDelete(id);
  }

  async restore(id: number) {
    const entity = await this.repo.findOne({ where: { id } });
    if (entity) throw new HttpException(ERRORS.ERROR_MICROSERVICE_NAME_XXX, HttpStatus.BAD_REQUEST);
    return await this.repo.restore(id);
  }
}
