import { createApp, ref } from 'vue'
import layout from './layout.js'

const App = {
    components: {
        layout
    },
    template: `
    <h1>App1</h1>
    <layout />
    `,
};

createApp(App).mount('#layout-app');