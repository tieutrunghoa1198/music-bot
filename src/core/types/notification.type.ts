import {InputType} from "@/core/types/input-type.type";
import {INotification} from "@/core/interfaces/notification.interface";
import {MessageNotification} from "@/core/services/noti/MessageNotification";
import {InteractionNotification} from "@/core/services/noti/InteractionNotification";

export const MAP_INPUT_TYPE = new Map<InputType, INotification>([
    [InputType.MESSAGE, MessageNotification.getInstance()],
    [InputType.INTERACTION, InteractionNotification.getInstance()],
]);