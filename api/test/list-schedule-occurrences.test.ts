import request from 'supertest';
import { initExpressApp } from '../src/loaders/express';
import { Frequency } from '../src/types';
import { ScheduleDoc } from '../src/models/schedule.model';
import mongoose from 'mongoose';
import { scheduleService } from '../src/services/schedule.service';

const app = initExpressApp();
const headers = {
  'Authorization': 'Bearer sldjflk',
  'Content-Type': 'application/json'
};

const makeRequest = async (scheduleId: string, startDate: string, endDate: string) => {
  return request(app)
    .get(`/api/v1/schedules/${ scheduleId }/occurrences`)
    .set(headers)
    .query({ startDate, endDate })
    .send();
};

const createSchedule = async (): Promise<ScheduleDoc> => {
  return scheduleService.createSchedule({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: 'fake-id',
    amount: 500,
    description: 'test description',
    frequency: Frequency.DAILY,
    startDate: '2020-05-01'
  });
};

it('returns a properly formatted list of occurrences on successful request', async () => {
  const schedule = await createSchedule();
  await schedule.save();
  const res = await makeRequest(schedule.id, '2020-05-01', '2021-05-01');
  expect(res.status).toBe(200);
  expect(res.body.object).toBe('list');
  expect(res.body.data.length).toBe(366);
  expect(res.body.data[0]).toStrictEqual({
    object: 'occurrence',
    date: schedule.startDate,
    amount: schedule.amount,
    description: schedule.description,
    schedule: schedule.id
  });
});

it('rejects requests without the startDate and endDate query parameters', async () => {
  const schedule = await createSchedule();
  await schedule.save();
  const res = await request(app)
    .get(`/api/v1/schedules/${ schedule.id }/occurrences`)
    .set(headers)
    .send();

  expect(res.status).toBe(400);
});