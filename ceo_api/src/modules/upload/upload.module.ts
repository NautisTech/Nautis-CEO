import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { ImageProcessorService } from './image-processor.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [UploadsController],
    providers: [UploadsService, ImageProcessorService],
    exports: [UploadsService, ImageProcessorService],
})
export class UploadsModule { }