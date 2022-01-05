import { Subscription, Unsubscribe, Dispatch, Action } from "hyperapp";
import IState from "../../interfaces/IState";

type Subscriber<S, P = any> = (
  dispatch: Dispatch<S>,
  payload: P
) => Unsubscribe;

interface ISubscriberOptions {
  key: string;
  action: Action<IState>;
}

const keydownSubscriber: Subscriber<IState, ISubscriberOptions> = (
  dispatch,
  options
) => {
  const handler = (ev: KeyboardEvent) => {
    if (ev.key !== options.key) return;
    dispatch(options.action);
  };
  // eslint-disable-next-line no-restricted-globals
  addEventListener("keydown", handler);
  // eslint-disable-next-line no-restricted-globals
  return () => removeEventListener("keydown", handler);
};

// eslint-disable-next-line import/prefer-default-export
export const onKeyDown: (
  key: string,
  action: Action<IState>
) => Subscription<IState, ISubscriberOptions> = (key, action) => [
  keydownSubscriber,
  { key, action },
];
