<template>
    <div class="page overlay">
        <div class="container stretch">
            <h1>{{$t('cast')}}</h1>
            <p>{{$t('found')}}</p>
            <div v-if="receivers" v-for="receiver in receivers" v-bind:key="receiver.id" class="ui receiver" :id="receiver.label" v-on:click="startSession">
                <header>{{receiver.friendlyName}}</header>
                <label>{{receiver.label}}</label>
            </div>
            <p v-else>No chromecast found</p>
            <button @click="startSession"><span>{{$t('start_session')}}</span></button>
            <button @click="stopSession"><span>{{$t('stop_session')}}</span></button>
            <button @click="stop"><span>{{$t('stop')}}</span></button>
            <button @click="pause"><span>{{$t('pause')}}</span></button>
        </div>
        <div class="container">
            <button class="icon" @mousedown.stop @click="$router.replace('/')" v-bind:title="$t('back')"><img src="static/controls/ic_chevron_left_white_48px.svg" /><span>{{$t('back')}}</span></button>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "back": "Back",
        "cast": "Cast Media",
        "found": "The following devices were found:",
        "start": "Start",
        "start_session": "Start Session",
        "stop_session": "Stop Session",
        "stop": "Stop",
        "pause": "Pause Playback"
    }
}
</i18n>

<script>
    import Utils from '@/mixins/Utils'

    export default {
        name: 'cast',
        mixins: [ Utils ],
        data () {
            return {
                appId: 'DEC70B1E',
                namespace: 'urn:x-cast:me.goodiesfor.bigbrother',
                receivers: undefined
            }
        },
        mounted () {
            this.preventDraggables()
            this.$extendedInput.selectEl()
            this.$chromecast.onFoundReceivers = this.onFoundReceivers
            this.$chromecast.start(this.appId, this.namespace)
            this.$chromecast.startSession()
        },
        beforeDestroy () {
            this.$chromecast.onFoundReceivers = null
        },
        methods: {
            onFoundReceivers (receivers) {
                this.receivers = Array.from(receivers)
            },
            startSession (e) {
                this.$chromecast.startSession(e)
            },
            stopSession (e) {
                this.$chromecast.stopSession()
            },
            stop (e) {
                this.$chromecast.stop(e)
            },
            pause (e) {
                this.$chromecast.pause(e)
            }
        }
    }
</script>

<style scoped>
    label {
        display: block;
    }
    
    .receiver {
        margin: 0.5em;
        padding: 0.5em;
        background-color: #111;
        color: #eee;
        cursor: pointer;
    }
    
    .receiver:hover {
        background-color: #222;
    }
    
    .receiver > * {
        pointer-events: none;
    }

    .header {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 5px;
    }

    .header .label { display: table-cell; vertical-align: middle; flex-grow: 1; padding: 0 10px; }
</style>