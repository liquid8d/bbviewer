import store from '../store'

const Plugins = {
    methods: {
        getPlugins () {
            return store.state.plugins
        },
        getPlugin (id) {
            return store.state.plugins[id]
        },
        registerPlugin (plugin) {
            if (!plugin.id) {
                console.error('plugin must have an id!')
            } else {
                if (store.state.plugins[plugin.id]) {
                    console.warn('plugin ' + plugin.id + ' already exists, overwriting!')
                }
                store.state.plugins[plugin.id] = plugin
                console.log('registered plugin ' + plugin.id)
            }
        }
    }
}

export default Plugins
