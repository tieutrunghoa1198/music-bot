import { SlashCommandBuilder } from '@discordjs/builders/dist';

/**
 * @desc To handle command with many types of interaction (Interaction, Message,...)
 */
export interface IDiscordCommand {
  execute: (interaction: any) => Promise<void>;
}

/**
 * @desc To handle component command such as button, select menu,...
 */
export interface IComponentCommand extends IDiscordCommand {
  customId: string; // todo: add types for specific component id
}

// --------------------------------

/**
 * @desc Interface for create slash command handler
 * - data: SlashCommandBuilder;
 * - hasAutoComplete?: boolean;
 * - autocomplete?: (interaction: any) => Promise<void>;
 */
export interface ISlashCommand extends IDiscordCommand {
  data:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  hasAutoComplete?: boolean;
  autocomplete?: (interaction: any) => Promise<void>;
}

/**
 * @desc Interface for creating select menu command handler (not UI)
 * - customId
 * - execute(interaction: any)
 */
export interface ISelectButtonCommand extends IComponentCommand {}

/**
 * @desc Interface for creating button command handler (not UI)
 * - customId
 * - execute(interaction: any)
 */
export interface IButtonCommand extends IComponentCommand {}
