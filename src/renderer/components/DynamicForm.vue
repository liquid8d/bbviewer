<template>
    <div class="form">
        <form>
            <div v-for="section in form.items" v-bind:key="section.id" class="section">
                <label>{{section.label}}</label>
                <p v-if="section.desc">{{section.desc}}</p>
                <div v-for="item in section.items" v-bind:key="item.id" class="item">
                    <div class="details">
                        <label>{{item.label}}</label>
                        <p v-if="item.desc">{{item.desc}}</p>
                        <div v-if="item.type === 'html'" v-html="item.html"></div>
                        <span v-if="item.type==='folder'">{{config[item.id] || 'default'}}</span>
                    </div>
                    <div v-if="item.type !== 'html'" class="input">
                        <button v-if="item.type==='button'" @click="item.onclick">{{item.label}}</button>
                        <input v-if="item.type === 'checkbox'" type="checkbox" :name="item.id" :checked="config[item.id]" @input="updateValue" @change="updateValue" />
                        <input v-if="item.type==='textbox'" :name="item.id" :type="item.type" :value="config[item.id]" @blur="updateValue" @keydown="allowKeys" />
                        <textarea v-if="item.type==='textarea'" :name="item.id" :value="config[item.id]" @blur="updateValue" @keydown="allowKeys" />
                        <input v-if="item.type==='number'" :name="item.id" :type="item.type" :value="config[item.id]" @blur="updateValue" @keydown="allowKeys" />
                        <select v-if="item.type==='select'" :name="item.id" :value="config[item.id]" @change="updateValue">
                            <option v-for="option in item.options" :key="option.id" :value="option.id" :selected="option.id === config[item.id]">{{option.label}}</option>
                        </select>
                        <button v-if="item.type==='folder'" :name="item.id" @click="setFolder(item.id, chooseFolder())">Choose</button>
                        <select v-if="item.type==='locale'" :name="item.id" :value="config[item.id]" @change="updateValue">
                            <option v-for="option in $store.state.locales" :key="option.id" :value="option.id" :selected="option.id === config[item.id]">{{option.label}}</option>
                        </select>
                        <!--
                        custom setting items
                        <div if="{type=='theme'}" each={theme in app.config.themes} onclick=app.setTheme('{theme.title}') title={theme.title} class=theme-circle></div>
                        <label if="{type=='hotkey'}" name={name} tabindex=-1>{value}</label>
                        -->
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import Utils from '../mixins/Utils'
    export default {
        computed: {
            config () {
                return this.$store.state.config
            }
        },
        mixins: [ Utils ],
        props: [ 'form' ],
        methods: {
            allowKeys (e) {
                if (this.$extendedInput.Keyboard.config.up.includes(e.which) ||
                    this.$extendedInput.Keyboard.config.down.includes(e.which) ||
                    this.$extendedInput.Keyboard.config.home.includes(e.which)) {
                    e.preventDefault()
                } else {
                    e.stopPropagation()
                }
            },
            setFolder (key, value) {
                this.$store.commit('saveConfig', { key: key, value: value })
            },
            updateValue (e) {
                if (e.target) {
                    if (e.target.type === 'checkbox') {
                        this.$store.commit('saveConfig', { key: e.target.name, value: e.target.checked })
                    } else if (e.target.type === 'text' || e.target.type === 'textarea' || e.target.type === 'number') {
                        if (e.target.value !== this.config[e.target.name]) {
                            this.$store.commit('saveConfig', { key: e.target.name, value: e.target.value })
                        }
                    } else if (e.target.type === 'select-one') {
                        this.$store.commit('saveConfig', { key: e.target.name, value: e.target.selectedOptions[0].value })
                        if (e.target.name === 'locale') {
                            this.restartApp()
                        }
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .form {
        text-align: center;
    }
    form {
        display: inline-block;
        text-align: left;
        padding: 0.5em;
        margin: 0 auto;
        max-width: 800px;
    }

    input[type="textbox"] {
        border-style:none;
        padding: 0.25em;
    }
    input[type="checkbox"] {
        padding: 2em;
    }
    input[type="checkbox"]:focus {
        outline:0.2em solid #0bcf74;
    }
    input[type="number"] {
        width: 5em;
    }
    select {
        padding: 0.25em;
        border: none;
    }
    .section {
        background-color: #222;
        border-radius: 0.2em;
        padding: 1em;
        margin: 1em;
    }

    .section > label {
        font-size: 1em;
        padding: 0.25em;
        margin-left: 0.25em;
        border-radius: 0.2em;
        color: #eee;
    }

    .section > p {
        font-size: 0.75em;
        padding: 0.5em;
        color:#888;
    }

    .item {
        display: flex;
        flex-direction: row;
        margin: 0.5em;
        padding: 0.5em;
        background-color: #333;
    }

    .item > .details {
        flex-grow: 1;
    }

    .item > .details > div, .item > .details > span {
        font-size: 0.75em;
        padding: 0.5em;
    }

    .item > .input {
        padding: 0.5em;
    }

    .item >>> label {
        margin-left: 0.25em;
        font-size: 1em;
        color:#0bcf74;
    }

    .item >>> p {
        font-size: 0.75em;
        padding: 0.5em;
        color:#888;
    }
</style>