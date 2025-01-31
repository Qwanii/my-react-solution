import mc from 'merge-change';
import { type LogInterface, State } from 'react-solution';
import type { GetQuery, Patch } from 'react-solution';
import { UsersApi } from '../users/api';
import { ProfileStoreConfig, ProfileStoreData } from './types';
import { AvatarApi } from '../users/avatar-api';

/**
 * Детальная информация о пользователе
 */
export class ProfileStore {
  readonly state;
  protected config: ProfileStoreConfig = {};

  constructor(
    protected depends: {
      usersApi: UsersApi;
      avatarApi: AvatarApi
      config?: Patch<ProfileStoreConfig>;
      logger: LogInterface;
    },
  ) {
    this.config = mc.merge(this.config, depends.config);
    this.depends.logger = this.depends.logger.named(this.constructor.name);
    this.state = new State<ProfileStoreData>(this.defaultState(), this.depends.logger);
  }

  defaultState(): ProfileStoreData {
    return {
      data: null,
      waiting: false, // признак ожидания загрузки
      avatar: ''
    };
  }

  /**
   * Загрузка профиля
   */
   async load(id: string ): Promise<any> {
    // Сброс текущего профиля и установка признака ожидания загрузки
    this.state.set({
      data: null,
      waiting: true,
      avatar: ''
    });

    const { data } = await this.depends.usersApi.findOne({id: id});

    // Профиль загружен успешно
    this.state.set(
      { 
        ...this.state.get(),
        data: data.result,
        waiting: false,
      },
      'Загружен профиль из АПИ',
    );
  }

  reset() {
    // Сброс текущего профиля и установка признака ожидания загрузки
    this.state.set({
      ...this.state.get(),
      avatar: '',
    },
  'сброс аватара');
  }

  async loadAvatar(_id: any): Promise<any>  {
    
    const { data } = await this.depends.avatarApi.findOne({id: _id})

    this.state.set(
      { 
        ...this.state.get(),
        avatar: data.result.url,
      },
      'Загружен аватар из АПИ',
    );
  }

  setProfileState(values: any) {
    this.state.set(
      { 
        ...this.state.get(),
        data: values,
      },
      'Изменен профиль',
    );
  }

}

