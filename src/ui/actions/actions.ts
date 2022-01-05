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

export const ToggleHighLight = (
  state: { highlight: boolean[] },
  index: number
) => {
  const highlight = [...state.highlight];

  highlight[index] = !highlight[index];

  return { ...state, highlight };
};

export const Select = (state: { ids: number[] }, selected: number) => [
  { ...state, selected },
  jsonFetcher(
    `https://jsonplaceholder.typicode.com/users/${state.ids[selected]}`,
    GotBio
  ),
];

export const SelectUp = (state: { selected: number }) => {
  if (state.selected === null) return state;
  return [Select, state.selected - 1];
};

export const SelectDown = (state: { selected: number }) => {
  if (state.selected === null) return state;
  return [Select, state.selected + 1];
};
