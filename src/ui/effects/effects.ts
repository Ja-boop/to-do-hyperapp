import { Action, Dispatch, Effect } from "hyperapp";
import IState from "../../interfaces/IState";

type Effecter<S, P> = (
  dispatch: Dispatch<S>,
  payload: P
) => void | Promise<void>;

interface IFetchJsonOptions {
  url: string;
  action: Action<IState, any>;
}

const fetchJson: Effecter<IState, IFetchJsonOptions> = async (
  dispatch,
  options
) => {
  const response = await fetch(options.url);
  const data = await response.json();
  dispatch(options.action, data);
};

// eslint-disable-next-line import/prefer-default-export
export const jsonFetcher: (
  url: string,
  action: Action<IState>
) => Effect<IState, IFetchJsonOptions> = (url, action) => [
  fetchJson,
  { url, action },
];
