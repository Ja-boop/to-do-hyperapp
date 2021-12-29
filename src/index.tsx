import { app } from 'hyperapp';
import html from 'hyperlit';

function api(url: string) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.json()
        })
}


const person = (props: { booleanProp: boolean, ontoggleProp: Function, nameProp: string }) =>
    html`
    <div>
        <div class=${{ person: true, highlight: props.booleanProp }}>
            <p>${props.nameProp}</p>
            <input type="checkbox" checked=${props.booleanProp} onclick=${props.ontoggleProp}>
        </div>
    </div>`


// --- ACTIONS ---

const ToggleHighLight = (state: { highlight: boolean }) => ({ ...state, highlight: !state.highlight })

app({
    init: [
        { name: "Leanne Graham", highlight: true },
    ],
    view: state => html`
        <main>
            ${person({ booleanProp: state.highlight, ontoggleProp: ToggleHighLight, nameProp: state.name })}
        </main>`,
    node: document.getElementById('app')!,
})

