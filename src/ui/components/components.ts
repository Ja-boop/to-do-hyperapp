import html from "hyperlit";

export const person = (props: {
  booleanProp: boolean;
  ontoggleProp: [Function, number];
  nameProp: string;
  selectedProp: boolean;
  onSelectProp: [Function, number];
}) => html` <div
  class=${{
    person: true,
    highlight: props.booleanProp,
    selected: props.selectedProp,
  }}
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

export const personBio = (props: { textProp: string }) =>
  html` <div class="bio">${props.textProp}</div>`;
