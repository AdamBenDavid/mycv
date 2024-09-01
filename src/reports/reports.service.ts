import { Body, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Reports } from './reports.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Reports) private repo: Repository<Reports>) {} //

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto as unknown);
    report.user = user;

    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });
    if (!report) {
      throw new NotFoundException('report not found');
    }

    report.approved = approved;
    return this.repo.save(report);
  }

  createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make=:make', { make })
      .andWhere('model=:model', { model })
      .andWhere('lng:lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat:lat BETWEEN -5 AND 5', { lat })
      .andWhere('year:year BETWEEN -3 AND 3', { year })
      .orderBy('ABS(mileage-:mileage)', 'DESC')
      .setParameters({ mileage })
      .getRawMany();
  }
}
