<template>
    <form>
        <div v-for="section in form.items" v-bind:key="section.id" class="section">
            <label>{{section.label}}</label>
            <p v-if="section.desc">{{section.desc}}</p>
            <div v-for="item in section.items" v-bind:key="item.id" class="item">
                <div class="details">
                    <label>{{item.label}}</label>
                    <p v-if="item.desc">{{item.desc}}</p>
                </div>
                <div class="input">
                    <input v-if="item.type==='checkbox'" tabindex="-1" :name="item.id" :type="item.type" :checked="form.getValue" v-on:change="form.setValue" />
                    <input v-if="item.type==='number'" :name="item.id" :type="item.type" :value="item.getValue || 0" :onblur="item.setValue" />
                    <button v-if="item.type==='button'" @click="item.onclick">{{item.label}}</button>
                    <!-- 
                    <select v-if="item.type==='select'" tabindex="-1" :name="item.id" :onchange="updateValue">
                        <option v-for="option in item.options" v-bind:key="option.id" :value="option.id" :selected="option.id === getValue(option.id)">{{option.label}}</option>
                    </select>
                    <input v-if="item.type==='textbox'" :name="item.id" :type="item.type" :value="item.value || ''" />
                    <textarea v-if="item.type==='textarea'" :name="item.id" :value="item.value || ''" />
                    <div v-if="item.type==='folder'">
                        <button tabindex=-1 :name="item.id" @click="folder = chooseFolder()">{{folder || 'Choose'}}</button>
                    </div> -->
                    <!-- custom setting items -->
                    <!--
                    <locale-selector if="{type=='locale'}"></locale-selector>
                    <div if="{type=='theme'}" each={theme in app.config.themes} onclick=app.setTheme('{theme.title}') title={theme.title} class=theme-circle></div>
                    <label if="{type=='hotkey'}" name={name} tabindex=-1>{value}</label>
                    <raw if="{type=='html'}" html="{html}"></raw>
                    -->
                </div>
            </div>
        </div>
    </form>
</template>

<script>
    import Utils from '../mixins/Utils'
    export default {
        data () {
            return {
                folder: ''
            }
        },
        mixins: [ Utils ],
        props: [ 'form' ]
    }
</script>

<style scoped>
    form {
        padding: 0.5em;
    }
    input[type="checkbox"] {
        padding: 2em;
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