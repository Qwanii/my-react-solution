import { z } from 'zod';
import mc from 'merge-change';
import type { FindQuery, LogInterface, Patch } from 'react-solution';
import { exclude } from 'react-solution';
import { DataParamsState, type DefaultConfig } from 'react-solution';
import type { RouterService } from 'react-solution';
import type { UsersApi } from '@src/features/users/api';
import { TUserData, TUserParams } from './types.js';

/**
 * Детальная информация о пользователе
 */
export class UsersStore extends DataParamsState<TUserData, TUserParams> {
  override defaultConfig() {
    return {
      ...super.defaultConfig(),
      queryParamsGroup: 'users',
    };
  }

  constructor(
    protected override depends: {
      env: Env;
      config?: Patch<DefaultConfig>;
      router: RouterService;
      usersApi: UsersApi;
      logger: LogInterface;
    },
  ) {
    super(depends);
  }

  override defaultState() {
    return mc.merge(super.defaultState(), {
      data: {
        items: [],
        allCount: 0,
        confirmCount: 0,
        count: 0,
        newCount: 0,
        rejectCount: 0
      },
      params: {
        limit: 10,
        query: '',
        email: '',
        status: ''
      },
    });
  }

  /**
   * Схема валидации восстановленных параметров
   */
  override paramsSchema() {
    return super.paramsSchema().extend({
      query: z.string().optional(),
    });
  }

  /**
   * Параметры для АПИ запроса
   * @param params Параметры состояния
   */
  protected override apiParams(params: TUserParams): FindQuery {
    const apiParams = mc.merge(super.apiParams(params), {
      fields: `items(*, roles(title, name)),count,allCount,newCount,confirmCount,rejectCount`,
      filter: {
        query: params.query,
        email: params.email,
        status: params.status =='all' ? '' : params.status
      },
    });

    return exclude(apiParams, {
      skip: 0,
      filter: {
        query: '',
        status: ''
      }
    });
  }

  /**
   * Загрузка данных
   * @param apiParams Параметры АПИ запроса
   */
  protected override async loadData(apiParams: FindQuery): Promise<TUserData> {
    // const response = await this.depends.articlesApi.findMany(apiParams);
    const response = await this.depends.usersApi.findMany(apiParams);
    // Установка полученных данных в состояние
    return response.data.result
  }
}