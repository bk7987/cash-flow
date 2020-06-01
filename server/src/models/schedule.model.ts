import mongoose from 'mongoose';
import { CreateScheduleDto } from './dto/schedule.dto';
import { Frequency, DayOfWeek, Month } from '../types';

interface ScheduleDoc extends mongoose.Document {
  id: string;
  amount: number;
  description: string;
  startDate: string;
  endDate: string;
  frequency: Frequency;
  interval: number;
  dayOfWeek: DayOfWeek;
  dayOfMonth: number;
  month: Month;
  recurrenceRule: string;
  userId: string;
}

interface ScheduleModel extends mongoose.Model<ScheduleDoc> {
  build(createScheduleDto: CreateScheduleDto): ScheduleDoc;
}

const scheduleSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  isRecurring: {
    type: Boolean,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    default: null,
    required: false
  },
  frequency: {
    type: String,
    required: false
  },
  interval: {
    type: Number,
    required: false,
    default: 1
  },
  dayOfWeek: {
    type: String,
    required: false,
    default: null
  },
  dayOfMonth: {
    type: Number,
    required: false,
    default: null
  },
  month: {
    type: String,
    required: false,
    default: null
  },
  recurrenceRule: {
    type: String,
    required: false,
    default: null
  },
  userId: {
    type: String,
    required: true,
    default: null
  }
}, {
  toJSON: {
    transform(doc: any, ret: any) {
      delete ret._id;
      delete ret.__v;
      return { object: 'schedule', id: ret.id, ...ret };
    }
  }
});

scheduleSchema.statics.build = (dto: CreateScheduleDto) => {
  dto.id = mongoose.Types.ObjectId().toHexString();
  return new Schedule(dto);
}

const Schedule = mongoose.model<ScheduleDoc, ScheduleModel>
  ('Schedule', scheduleSchema);

export { ScheduleDoc, Schedule };