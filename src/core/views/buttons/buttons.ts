import {
  MessageActionRow,
  MessageButton,
  MessageButtonStyleResolvable,
} from 'discord.js';
import PreviousButton from '@/features/audio-player/buttons/previous.button';
import NextButton from '@/features/audio-player/buttons/next.button';
import { MessageButtonStyles } from 'discord.js/typings/enums';

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
    PreviousButton.customId,
    '← Trang Trước',
    MessageButtonStyles.PRIMARY,
    isPrevDisable,
  );
  const nextButton = CreateButton(
    NextButton.customId,
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
