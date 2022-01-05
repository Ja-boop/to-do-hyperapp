import { app } from "hyperapp";
import html from "hyperlit";
import IState from "./interfaces/IState";
import { GotNames } from "./ui/actions/actions";

const fetchJson = (dispatch: Function, options: { url: string; action: Function }) => {
  fetch(options.url)
    .then((response) => response.json())
    .then((data) => dispatch(options.action, data));
};

const jsonFetcher = (url: string, action: Function) => [fetchJson, { url, action }];

const keydownSubscriber = (dispatch: Function, options: { key: string; action: Function }) => {
  const handler = (ev: KeyboardEvent) => {
    if (ev.key !== options.key) return;
    dispatch(options.action);
  };
  // eslint-disable-next-line no-restricted-globals
  addEventListener("keydown", handler);
  // eslint-disable-next-line no-restricted-globals
  return () => removeEventListener("keydown", handler);
};

const onKeyDown = (key: string, action: Function) => [keydownSubscriber, { key, action }];

// --- COMPONENTS ---

const person = (props: {
  booleanProp: boolean;
  ontoggleProp: [Function, number];
  nameProp: string;
  selectedProp: boolean;
  onSelectProp: [Function, number];
}) => html` <div
  class=${{ person: true, highlight: props.booleanProp, selected: props.selectedProp }}
  onclick=${props.onSelectProp}
>
  <p>${props.nameProp}</p>
  <input
    type="checkbox"
    class="checkbox-test"
    checked=${props.booleanProp}
    onclick=${(_: [], event: Event) => {
      event.stopPropagation();
      return props.ontoggleProp;
    }}
  />
</div>`;

const personBio = (props: { textProp: string }) => html` <div class="bio">${props.textProp}</div>`;

// --- ACTIONS ---

const GotBio = (state: [], data: { company: { bs: string } }) => ({
  ...state,
  bio: data.company.bs,
});

const ToggleHighLight = (state: { highlight: boolean[] }, index: number) => {
  const highlight = [...state.highlight];

  highlight[index] = !highlight[index];

  return { ...state, highlight };
};

const Select = (state: { ids: number[] }, selected: number) => [
  { ...state, selected },
  jsonFetcher(`https://jsonplaceholder.typicode.com/users/${state.ids[selected]}`, GotBio),
];

const SelectUp = (state: { selected: number }) => {
  if (state.selected === null) return state;
  return [Select, state.selected - 1];
};

const SelectDown = (state: { selected: number }) => {
  if (state.selected === null) return state;
  return [Select, state.selected + 1];
};

// --- RUN ---

const baseState: IState = {
  names: [],
  highlight: [],
  selected: null,
  bio: null,
  ids: [],
};

app({
  init: [baseState, jsonFetcher(`https://jsonplaceholder.typicode.com/users`, GotNames)],
  view: (state) => html` <main>
    ${state.names.map((name, index) =>
      person({
        booleanProp: state.highlight[index],
        ontoggleProp: [ToggleHighLight, index],
        nameProp: name,
        selectedProp: state.selected === index,
        onSelectProp: [Select, index],
      })
    )}
    ${state.bio && personBio({ textProp: state.bio })}
  </main>`,
  subscriptions: (state) => [
    state.selected !== null && state.selected > 0 && onKeyDown("ArrowUp", SelectUp),

    state.selected !== null &&
      state.selected < state.ids.length - 1 &&
      onKeyDown("ArrowDown", SelectDown),
  ],
  node: document.getElementById("app")!,
});
