import { omit } from "lodash";
import { Frequency, CreateScheduleDto, EditScheduleDto } from "../types";
import { Schedule, ScheduleDoc } from "../models";
import { BadRequestError, NotAuthorizedError } from "../errors";
import { occurrenceService } from ".";

class ScheduleService {
  private removeUnnecessaryFields(dto: CreateScheduleDto): CreateScheduleDto {
    dto = dto.occurrenceCount ? omit(dto, "endDate") : dto;

    switch (dto.frequency) {
      case Frequency.ONCE:
        dto.occurrenceCount = 1;
        return omit(dto, ["month", "dayOfWeek", "dayOfMonth", "endDate", "interval"]);
      case Frequency.DAILY:
        return omit(dto, ["month", "dayOfMonth", "dayOfWeek"]);
      case Frequency.WEEKLY:
        return omit(dto, ["dayOfMonth", "month"]);
      case Frequency.MONTHLY:
        return omit(dto, ["dayOfWeek", "month"]);
      case Frequency.YEARLY:
        return omit(dto, "dayOfWeek");
      default:
        return dto;
    }
  }

  private async nullUnnecessaryFields(schedule: ScheduleDoc) {
    switch (schedule.frequency) {
      case Frequency.ONCE:
        schedule.set({
          interval: 1,
          month: null,
          dayOfWeek: null,
          dayOfMonth: null,
          endDate: null,
          occcurenceCount: 1,
        });
        return;
      case Frequency.DAILY:
        if (schedule.occurrenceCount) schedule.set({ endDate: null });
        schedule.set({ month: null, dayOfWeek: null, dayOfMonth: null });
        return;
      case Frequency.WEEKLY:
        if (schedule.occurrenceCount) schedule.set({ endDate: null });
        schedule.set({ month: null, dayOfMonth: null });
        return;
      case Frequency.MONTHLY:
        if (schedule.occurrenceCount) schedule.set({ endDate: null });
        schedule.set({ month: null, dayOfWeek: null });
        return;
      case Frequency.YEARLY:
        if (schedule.occurrenceCount) schedule.set({ endDate: null });
        schedule.set({ dayOfWeek: null });
        return;
    }
  }

  private validateDates(dto: EditScheduleDto, schedule: ScheduleDoc) {
    if (dto.startDate && dto.endDate) {
      if (dto.startDate > dto.endDate) {
        throw new BadRequestError("The start date must occur before the end date.");
      }
    }

    if (dto.startDate && !dto.endDate && schedule.endDate) {
      if (dto.startDate >= schedule.endDate) {
        throw new BadRequestError("The start date must occur before the existing end date.");
      }
    }

    if (dto.endDate && !dto.startDate) {
      if (dto.endDate <= schedule.startDate) {
        throw new BadRequestError("The end date must occur after the existing start date.");
      }
    }
  }

  async createSchedule(dto: CreateScheduleDto): Promise<ScheduleDoc> {
    dto = this.removeUnnecessaryFields(dto);
    dto.recurrenceRule = occurrenceService.generateRecurrenceRule(dto);

    if (dto.endDate && dto.endDate < dto.startDate) {
      throw new BadRequestError("The end date must occur after the start date.");
    }

    if (dto.endDate && !occurrenceService.scheduleHasOccurrencesBetween(dto, dto.startDate, dto.endDate)) {
      throw new BadRequestError("The provided schedule has no occurrences.");
    }

    const schedule = Schedule.build(dto);
    await schedule.save();
    return schedule;
  }

  async getSchedules(userId: string): Promise<ScheduleDoc[]> {
    return Schedule.find({ userId });
  }

  async getScheduleById(scheduleId: string): Promise<ScheduleDoc> {
    const schedule = await Schedule.findOne({ id: scheduleId });

    if (!schedule) {
      throw new NotAuthorizedError();
    }

    return schedule;
  }

  async getScheduleOccurrences(scheduleId: string, startDate: string, endDate: string) {
    const schedule = await this.getScheduleById(scheduleId);
    return occurrenceService.getOccurrencesBySchedule(schedule, startDate, endDate);
  }

  async deleteSchedule(scheduleId: string): Promise<ScheduleDoc> {
    const schedule = await this.getScheduleById(scheduleId);
    await schedule.remove();
    return schedule;
  }

  async editSchedule(dto: EditScheduleDto): Promise<ScheduleDoc> {
    const schedule = await this.getScheduleById(dto.id);

    if (dto.endDate === "") {
      dto.endDate = null;
    }
    this.validateDates(dto, schedule);

    schedule.set(dto);
    this.nullUnnecessaryFields(schedule);
    schedule.set("recurrenceRule", occurrenceService.generateRecurrenceRule(schedule));

    if (!occurrenceService.scheduleHasOccurrencesBetween(schedule, schedule.startDate, schedule.endDate)) {
      throw new BadRequestError("The edited schedule has no occurrences.");
    }

    await schedule.save();
    return schedule;
  }
}

const scheduleService = new ScheduleService();
Object.freeze(scheduleService);
export { scheduleService };