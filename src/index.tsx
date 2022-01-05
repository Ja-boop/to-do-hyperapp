import { app } from "hyperapp";
import html from "hyperlit";
import IState from "./interfaces/IState";
import { person, personBio } from "./ui/components/components";
import {
  GotNames,
  ToggleHighLight,
  Select,
  SelectDown,
  SelectUp,
} from "./ui/actions/actions";
import { jsonFetcher } from "./ui/effects/effects";

const keydownSubscriber = (
  dispatch: Function,
  options: { key: string; action: Function }
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

const onKeyDown = (key: string, action: Function) => [
  keydownSubscriber,
  { key, action },
];

// --- RUN ---

const baseState: IState = {
  names: [],
  highlight: [],
  selected: null,
  bio: null,
  ids: [],
};

app({
  init: [
    baseState,
    jsonFetcher(`https://jsonplaceholder.typicode.com/users`, GotNames),
  ],
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
    state.selected !== null &&
      state.selected > 0 &&
      onKeyDown("ArrowUp", SelectUp),

    state.selected !== null &&
      state.selected < state.ids.length - 1 &&
      onKeyDown("ArrowDown", SelectDown),
  ],
  node: document.getElementById("app")!,
});
