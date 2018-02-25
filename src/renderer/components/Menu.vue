<template>
    <div class="menu">
        <template v-for="item in items">
            <div v-if="item.content" v-bind:key="item.id" class="item">
                <img v-if="item.icon" :src="item.icon" class="icon" />
                <volume v-if="item.content === 'volume'"></volume>
                <audio-pan v-if="item.content === 'audiopan'"></audio-pan>
                <speed v-if="item.content === 'playbackrate'"></speed>
                <div v-if="item.content === 'resize'" class="pills">
                    <button @click="resizeWindow(640, 360)">{{$t('winSmall')}}</button>
                    <button @click="resizeWindow(800, 450)">{{$t('winMed')}}</button>
                    <button @click="resizeWindow(1280, 720)">{{$t('winLarge')}}</button>
                </div>
            </div>
            <div v-else v-bind:key="item.id" class="ui item" tabindex="-1" @mousedown.stop @click="(item.click) ? item.click($event) : null">
                <img v-if="item.icon" :src="item.icon" class="icon" />
                <span>{{item.label}}</span>
            </div>
        </template>
    </div>
</template>

<i18n>
{
    "en": {
        "about": "About",
        "back": "Back",
        "donate": "Donate",
        "notifications": "Notifications",
        "settings": "Settings",
        "window": "New Window",
        "winSmall": "S",
        "winMed": "M",
        "winLarge": "L"
    }
}
</i18n>
<script>
    import Volume from './Controls/Volume'
    import Utils from '@/mixins/Utils'
    const { PlayerEvents } = require('./Player/PlayerEvents')

    export default {
        name: 'app-menu',
        mixins: [ Utils ],
        components: { Volume },
        props: {
            menuItems: {
                type: Array
            }
        },
        data () {
            return {
                items: null
            }
        },
        mounted () {
            this.items = this.menuItems || []
            this.preventDraggables()
            this.$extendedInput.selectEl()
        },
        methods: {
            playerRedirect (event, arg) {
                if (arg) PlayerEvents.$emit(event, arg); else PlayerEvents.$emit(event)
            }
        }
    }
</script>

<style scoped>
    .menu {
        min-width: 12em;
        padding: 0.5em 0 0.5em 0;
        background: #1b1f22;
        overflow: auto;
    }

    .menu > .item {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 0.05em;
        padding: 0.5em;
        cursor: pointer;
        border-bottom:  0.05em solid #24292e;
    }

    .menu > .item:last-child {
        border-bottom: none;
    }

    .menu > .item > .icon {
        display: flex;
        flex-grow: 0;
        width: 1.75em;
        height: 1.25em;
        align-items: center;
    }

    .menu > .item > span {
        flex-grow: 1;
        text-align: center;
        color: #eee;
    }

    .menu > .item > :nth-child(2) {
        flex-grow: 1;
        line-height: 1.25em;
        font-size: 0.9em;
        text-align: center;
        color: #eee;
    }

    .menu > .item > .pills {
        display: inline-flex;
        justify-content: center;
        padding: 0;
    }    
</style>