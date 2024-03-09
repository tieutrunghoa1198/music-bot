import { SlashCommandBuilder } from '@discordjs/builders/dist';

export interface ICommand {
  data:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  hasAutoComplete?: boolean;
  execute: (interaction: any) => Promise<void>;
  autocomplete?: (interaction: any) => Promise<void>;
}
