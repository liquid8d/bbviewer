<template>
    <div class="page overlay">
        <div class="container">
            <h2>{{$t('notifications')}}</h2>
        </div>
        <div class="list container">
            <template>
                <notification v-for="n in notifications" :key="n.id" :title="n.title" :desc="n.desc" :icon="n.icon" :action="n.action" :actionTitle="n.actionTitle"></notification>
            </template>
        </div>
        <div class="container">
            <button class="icon" @mousedown.stop @click="$router.replace('/')" v-bind:title="$t('back')"><img src="static/controls/ic_chevron_left_white_48px.svg" /><span>{{$t('back')}}</span></button>
            <button class="icon" @mousedown.stop @click="retrieve" v-bind:title="$t('refresh')"><img src="static/controls/ic_refresh_white_48px.svg" /><span>{{$t('refresh')}}</span></button>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "back": "Back",
        "notifications": "Notifications",
        "refresh": "Force Update"
    }
}
</i18n>

<script>
    import Bar from '../Bar.vue'
    import Notification from './Notification'

    const NotifyEvents = require('./NotifyEvents')

    export default {
        components: { Bar, Notification },
        computed: {
            notifications () {
                return this.$store.notifications
            }
        },
        methods: {
            add (opts) {
                opts.id = this.counter
                this.notifications.push(opts)
                this.counter++
            },
            retrieve () {
                NotifyEvents.retrieve()
            }
        }
    }
</script>

<style scoped>
    .reverse { flex-direction: column; }

    .list {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        flex-grow:1;
        padding: 0.5em;
        height: 100%;
        width: 100%;
        min-width: 8em;
        overflow: auto;
    }
</style>
