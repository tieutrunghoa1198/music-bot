import {interactionCreateStream} from "@/core/services/others/interaction-create.service";
import {MUSIC_COMMAND_MAP} from "@/core/commands/music.command";
import {ephemeralResponse} from "@/core/utils/common.util";
import * as Constant from "@/core/constants/index.constant";
import {BUTTON_AUDIO_PLAYER_MAP, SELECT_MENU_AUDIO_PLAYER_MAP} from "@/features/audio-player/constants/map.constant";
import {MODERATING_MESSAGE_COMMAND_MAP} from "@/core/commands/moderating-message.command";

export class InteractionHandler {

    constructor() {
        this.executeButtonCommand();
        this.executeSlashCommand();
        this.executeSelectMenu();
        this.executeAutoComplete();
        this.executeModeratingMessage();
    }

    executeSlashCommand() {
        interactionCreateStream
            .getInteractionSlashCommand()
            .subscribe(async (interaction) => {
                const audioPlayerSlashCommand = MUSIC_COMMAND_MAP.get(
                    interaction.commandName,
                );

                const isUserInVoiceChannel = interaction.member.voice.channel;
                if (!isUserInVoiceChannel && audioPlayerSlashCommand) {
                    await interaction.deferReply();
                    await ephemeralResponse(
                        interaction,
                        Constant.Messages.userJoinVoiceChannel(interaction.user.toString()),
                    );
                    return;
                }

                if (audioPlayerSlashCommand === undefined) return;
                await audioPlayerSlashCommand.execute(interaction);
            })
        ;
    }

    executeSelectMenu() {
        interactionCreateStream
            .getInteractionSelectMenu()
            .subscribe(async (interaction) => {
                const selectMenu = SELECT_MENU_AUDIO_PLAYER_MAP.get(interaction.customId);

                if (selectMenu === undefined) return;
                await selectMenu.execute(interaction);
            })
        ;
    }

    executeButtonCommand() {
        interactionCreateStream
            .getInteractionButtonCommand()
            .subscribe(async (interaction) => {
                const buttonCommand = BUTTON_AUDIO_PLAYER_MAP.get(interaction.customId);

                if (buttonCommand === undefined) return;
                await buttonCommand.execute(interaction);
            })
        ;
    }

    executeAutoComplete() {
        interactionCreateStream
            .getInteractionAutoComplete()
            .subscribe(async (interaction) => {
                const audioPlayerSlashCommand = MUSIC_COMMAND_MAP.get(
                    interaction.commandName,
                );

                if (audioPlayerSlashCommand === undefined) return;
                if (
                    audioPlayerSlashCommand.hasAutoComplete &&
                    audioPlayerSlashCommand.autocomplete
                )
                    await audioPlayerSlashCommand.autocomplete(interaction);
            })
        ;
    }

    executeModeratingMessage() {
        interactionCreateStream
            .getInteractionSlashCommand()
            .subscribe(async (interaction) => {
                const command = MODERATING_MESSAGE_COMMAND_MAP.get(interaction.commandName);

                if (command === undefined) return;
                await command.execute(interaction);
            })
        ;
    }

}

