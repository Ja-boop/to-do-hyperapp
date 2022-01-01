import { app } from "hyperapp";
import html from "hyperlit";

const fetchJson = (dispatch: Function, options: { url: string; action: Function }) => {
  fetch(options.url)
    .then((response) => response.json())
    .then((data) => dispatch(options.action, data));
};

const jsonFetcher = (url: string, action: Function) => [fetchJson, { url, action }];

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
  jsonFetcher(`https://jsonplaceholder.typicode.com/posts/${state.ids[selected]}`, GotBio),
];

const GotNames = (state: [], data: []) => ({
  ...state,
  names: data.slice(0, 5).map((x: { name: string }) => x.name),
  ids: data.slice(0, 5).map((x: { id: number }) => x.id),
  highlight: [false, false, false, false, false],
});

// --- RUN ---

app({
  init: [
    { names: [], highlight: [], selected: null, bio: "", ids: [] },
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
  node: document.getElementById("app")!,
});
