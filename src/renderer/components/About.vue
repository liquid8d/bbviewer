<template>
    <div class="page overlay">
        <div class="container stretch">
            <span class="title" v-t="'about'"></span>
            <div class="items">
                <div class="item">Version: <span class="value">{{ $store.state.version }}</span></div>
                <div class="item">Build: <span class="value">{{ $store.state.build }}</span></div>
                <div class="item">Vue.js: <span class="value">{{ vue }}</span></div>
                <template v-if="$store.state.isElectron">
                    <div class="item">Electron:<span class="value">{{ electron }}</span></div>
                    <div class="item">Node: <span class="value">{{ node }}</span></div>
                    <div class="item">Platform: <span class="value">{{ platform }}</span></div>
                </template>
            </div>
            <div class="pad">
                <a @click="open('https://github.com/SimulatedGREG/electron-vue')"><img src="static/logo.png"></a>
                <p v-t="'credits.electron-vue'"></p>
            </div>
        </div>
        <div class="container">
            <button class="icon" @mousedown.stop @click="$router.replace('/')" v-bind:title="$t('back')"><img src="static/controls/ic_chevron_left_white_48px.svg" /><span>{{$t('back')}}</span></button>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "credits": {
            "electron-vue": "Thank you to electron-vue for a semi-sane way to build electron-vue + web apps!"
        }
    }
}
</i18n>

<script>
    import Utils from '@/mixins/Utils'
    export default {
        name: 'about',
        data () {
            return {
                electron: process.versions['atom-shell'],
                node: process.versions.node,
                platform: require('os').platform(),
                vue: require('vue/package.json').version
            }
        },
        mixins: [ Utils ],
        mounted () {
            this.preventDraggables()
            this.$extendedInput.selectEl()
        }
    }
</script>

<style>
    a {
        margin-right: 1em;
        cursor: pointer;
    }

    img {
        height: 2em;
        padding: 0;
    }

    .pad {
        padding: 1em;
    }

    .items {
        padding: 1em;
    }
</style>
