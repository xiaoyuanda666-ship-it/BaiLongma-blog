import * as migration_20260422_050250_init_media_and_cover from './20260422_050250_init_media_and_cover';

export const migrations = [
  {
    up: migration_20260422_050250_init_media_and_cover.up,
    down: migration_20260422_050250_init_media_and_cover.down,
    name: '20260422_050250_init_media_and_cover'
  },
];
