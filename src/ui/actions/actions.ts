import { Action } from "hyperapp";
import IState from "../../interfaces/IState";
import { jsonFetcher } from "../effects/effects";

export type ActionDescriptor<S, P> = (P | Action<S, P>)[];

export const GotBio: Action<IState, any> = (state, data) => ({
  ...state,
  bio: data.company.bs,
});

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

export const ToggleHighLight: Action<IState, any> = (state, index) => {
  const highlight = [...state.highlight];

  highlight[index] = !highlight[index];

  return { ...state, highlight };
};

export const Select: Action<IState, any> = (state, selected) => [
  { ...state, selected },
  jsonFetcher(
    `https://jsonplaceholder.typicode.com/users/${state.ids[selected]}`,
    GotBio
  ),
];

export const SelectUp: Action<IState> = (state) => {
  if (state.selected === null) return state;
  return [Select, state.selected - 1];
};

export const SelectDown: Action<IState> = (state) => {
  if (state.selected === null) return state;
  return [Select, state.selected + 1];
};
