import {registerMessageRestrictListener} from './listeners/restrict-message.listener';

export const initModeratingMessage = () => {
  registerMessageRestrictListener();
};
