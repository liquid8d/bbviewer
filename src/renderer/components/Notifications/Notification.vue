<template>
    <div class="notification" @click.prevent.stop="runAction(action)">
        <div class="content">
            <div v-if="icon" class="notify-icon" :style="'backgroundImage: url(\'' + icon + '\');'"></div>
            <div class="row">
                <h2 class="title" v-html="title">{{title}}</h2>
                <p class="desc" v-html="desc">{{desc}}</p>
            </div>
        </div>
        <div class="options">
            <button v-if="action" class="icon" :title="actionTitle" @click.stop.prevent="runAction"><img src="static/controls/ic_video_library_white_48px.svg"><span>{{actionTitle}}</span></button>
            <button class="icon" :title="$t('dismiss')" @click.stop.prevent="dismiss"><img src="static/controls/ic_cancel_white_48px.svg"><span>{{$t('dismiss')}}</span></button>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "open": "Open",
        "dismiss": "Dismiss"
    }
}
</i18n>

<script>
    const { PlayerEvents } = require('../Player/PlayerEvents')

    export default {
        name: 'notification',
        props: [ 'title', 'desc', 'icon', 'action', 'actionTitle' ],
        components: { PlayerEvents },
        methods: {
            runAction () {
                if (this.action) {
                    let cmd = this.action.substr(0, this.action.indexOf(':'))
                    let param = this.action.substr(this.action.indexOf(':') + 1, this.action.length)
                    if (cmd === 'route') {
                        this.$router.push(param)
                    } else if (cmd === 'play') {
                        try {
                            param = JSON.parse(param)
                        } catch (err) {}
                        PlayerEvents.$emit('play', param)
                        this.$router.replace('/')
                    }
                }
                this.dismiss()
            },
            dismiss () {
                PlayerEvents.$emit('clearNotice')
            }
        }
    }
</script>

<style scoped>
    .notification {
        margin: 0.5em;
        cursor: pointer;
        pointer-events: auto;
        background: rgb( 25, 25, 25 );
        width: auto;
        border-radius: 0.2em;
        border: 0.05em solid #333;
        box-sizing: border-box;
        color: rgb(200,200,200);
    }

    .notify-icon {
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
        height: 3em;
        width: 3em;
        margin: 0.5em;
    }
    .content {
        display: flex;
        flex-direction: row;
        padding: 0.25em 0.5em 0.5em 0.5em;
    }

    .content .row {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0.5em;
    }

    .options {
        padding: 0.2em;
        border-top: 1px solid rgb( 40, 40, 40 );
        max-height: 2.75em;
        text-align: center;
        width: 100%;
    }
</style>