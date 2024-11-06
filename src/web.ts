import { WebPlugin } from '@capacitor/core';

import type { MapboxPluginPlugin } from './definitions';

export class MapboxPluginWeb extends WebPlugin implements MapboxPluginPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
