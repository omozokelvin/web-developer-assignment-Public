import { connection } from '../connection';

import {
  selectCountOfUsersTemplate,
  selectUsersTemplate,
  selectUsersWithAddressLeftJoinTemplate,
  selectUserWithAddressByIdTemplate,
} from './query-templates';
export const getUserWithAddressById = (
  id: string
): Promise<UserWithAddress | undefined> =>
  new Promise((resolve, reject) => {
    connection.get<UserWithAddress>(
      selectUserWithAddressByIdTemplate,
      [id],
      (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      }
    );
  });
import { User, UserWithAddress } from './types';

export const getUsersCount = (): Promise<number> =>
  new Promise((resolve, reject) => {
    connection.get<{ count: number }>(
      selectCountOfUsersTemplate,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.count);
      }
    );
  });

export const getUsers = (
  pageNumber: number,
  pageSize: number
): Promise<User[]> =>
  new Promise((resolve, reject) => {
    connection.all<User>(
      selectUsersTemplate,
      [(pageNumber - 1) * pageSize, pageSize],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      }
    );
  });

export const getUsersWithAddressLeftJoin = (
  pageNumber: number,
  pageSize: number
): Promise<UserWithAddress[]> =>
  new Promise((resolve, reject) => {
    connection.all<UserWithAddress>(
      selectUsersWithAddressLeftJoinTemplate,
      [(pageNumber - 1) * pageSize, pageSize],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      }
    );
  });
