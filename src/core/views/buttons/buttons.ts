import {
  MessageActionRow,
  MessageButton,
  MessageButtonStyleResolvable,
} from 'discord.js';
import { MessageButtonStyles } from 'discord.js/typings/enums';
import { previousPageCommandButton } from '@/features/audio-player/buttons/previous-page-command.button';
import { nextPageCommandButton } from '@/features/audio-player/buttons/next-page-command.button';

export const generateButton = (
  currentPage: number,
  maxPage: number,
): MessageActionRow => {
  let isPrevDisable = false;
  let isNextDisable = false;
  if (currentPage <= 1) {
    isPrevDisable = true;
  }
  if (currentPage >= maxPage) {
    isNextDisable = true;
  }

  const prevButton = CreateButton(
    previousPageCommandButton.customId,
    '← Trang Trước',
    MessageButtonStyles.PRIMARY,
    isPrevDisable,
  );
  const nextButton = CreateButton(
    nextPageCommandButton.customId,
    'Trang Sau →',
    MessageButtonStyles.PRIMARY,
    isNextDisable,
  );
  return new MessageActionRow()
    .addComponents(prevButton)
    .addComponents(nextButton);
};

export const CreateButton = (
  customId: string,
  label: string,
  style: MessageButtonStyleResolvable,
  isDisable: boolean,
) => {
  return new MessageButton()
    .setCustomId(customId)
    .setLabel(label)
    .setStyle(style)
    .setDisabled(isDisable);
};
