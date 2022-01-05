import { Action } from "hyperapp";
import IState from "../../interfaces/IState";

export type ActionDescriptor<S, P> = (P | Action<S, P>)[];

export const GotNames: Action<IState, any> = (state, data) => {
  const names: string[] = data.slice(0, 5).map((person: any) => person.name);
  const ids: number[] = data.slice(0, 5).map((person: any) => person.id);

  return {
    ...state,
    ids,
    names,
    highlight: [false, false, false, false, false],
  };
};
