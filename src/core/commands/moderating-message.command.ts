import { cleanMessageCommand } from '@/features/moderating-message/cmd-slash/clean-message.command';
import { restrictCommand } from '@/features/moderating-message/cmd-slash/restrict.command';
import { setMusicAreaCommand } from '@/features/moderating-message/cmd-slash/set-music-area.command';
import { statusCommand } from '@/features/moderating-message/cmd-slash/status.command';
import { testCommand } from '@/features/moderating-message/cmd-slash/test.command';

export const ModeratingMessageCommand = {
  cleanMessageCommand,
  restrictCommand,
  setMusicAreaCommand,
  statusCommand,
  testCommand,
};

export const MODERATING_MESSAGE_COMMAND_MAP = new Map(
  Object.entries(ModeratingMessageCommand).map((value) => [
    value[1].data.name,
    value[1],
  ]),
);
