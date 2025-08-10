import {botClient} from '@/bot-client';
import {Message} from 'discord.js';
import {eventBus} from '@/core/utils/event-bus.util';

export const EventsRouter = () => {

  botClient.on('messageCreate', (message: Message) => {
    eventBus.emit('message:created', message);
  });

  botClient.on('voiceStateUpdate', (oldState, newState) => {
    eventBus.emit('voice:updated', oldState, newState);
  });

  botClient.on('interactionCreate', async (interaction: any) => {
    eventBus.emit('interaction:received', interaction);
  });

};
