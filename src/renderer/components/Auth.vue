<template>
    <div class="page overlay">
        <div class="backdrop" style="flex-grow:1">
            <webview v-if="$store.state.isElectron" ref="browser" @keydown="checkKeys" @mousedown.stop class="browser" :src="auth.url" webpreferences="allowRunningInsecureContent"></webview>
            <div v-else class="container">
                <p>{{$t('authWeb')}}</p>
                <a :href="auth.url" target="_blank">Authenticate</a>
            </div>
        </div>
        <div class="container">
            <img class="icon" src="static/controls/ic_vpn_key_white_48px.svg" />
            <h3>{{auth.title}}</h3>
            <p>{{auth.desc}}</p>
        </div>
        <div class="container">
            <button ref="backButton" class="icon" @mousedown.stop @click="$router.replace('/')" v-bind:title="$t('back')"><img src="static/controls/ic_chevron_left_white_48px.svg" /><span>{{$t('back')}}</span></button>
            <button class="icon" @mousedown.stop @click.stop="reload" v-bind:title="$t('reload')"><img src="static/controls/ic_refresh_white_48px.svg" /><span>{{$t('reload')}}</span></button>
            <button class="icon" @mousedown.stop @click.stop="back" v-bind:title="$t('historyBack')"><img src="static/controls/ic_chevron_left_white_48px.svg" /><span>{{$t('historyBack')}}</span></button>
            <button class="icon" @mousedown.stop @click.stop="forward" v-bind:title="$t('historyForward')"><img src="static/controls/ic_chevron_right_white_48px.svg" /><span>{{$t('historyForward')}}</span></button>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "authWeb": "To authenticate in a web browser, you'll need to click the link below.",
        "back": "Back",
        "historyBack": "History",
        "historyForward": "History",
        "reload": "Reload"
    }
}
</i18n>

<script>
    export default {
        name: 'auth',
        data () {
            return {
                auth: {
                    url: 'static/html/auth.html',
                    title: 'Authenticate',
                    desc: 'Choose a service above if you need to authenticate'
                }
            }
        },
        mounted () {
            if (this.$route.query.url !== undefined) {
                this.auth.url = this.$route.query.url
                this.auth.title = this.$route.query.title
                this.auth.desc = this.$route.query.desc
                if (this.$refs.browser && this.$route.query.url) this.$refs.browser.src = this.$route.query.url
            } else {
                this.auth = {
                    url: 'static/html/auth.html',
                    title: 'Authenticate',
                    desc: 'Choose a service above if you need to authenticate'
                }
            }
        },
        methods: {
            checkKeys (e) {
                if (this.$extendedInput.Keyboard.config.down.includes(e.which)) {
                    this.$extendedInput.selectEl(this.$refs.backButton.$el)
                } else if (this.$extendedInput.Keyboard.config.select.includes(e.which) ||
                this.$extendedInput.Keyboard.config.back.includes(e.which)) {
                    e.stopPropagation()
                }
            },
            back () {
                if (this.$refs.browser.canGoBack()) this.$refs.browser.goBack()
            },
            forward () {
                if (this.$refs.browser.canGoForward()) this.$refs.browser.goForward()
            },
            reload () {
                this.$refs.browser.reload()
            },
            test () {
                this.$refs.browser.src = 'https://www.cbs.com/all-access/user/signin/'
            }
        }
    }
</script>

<style scoped>
    .backdrop {
        background-color: #222;
        position: relative;
        margin: 0.5em;
        padding: 0;
    }
    .browser {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 0.1em solid #333;
    }
    .browser > object {
        overflow: auto;
    }

    button {
        min-width: 4em;
    }

    img.icon {
        float: left;
        width: 1.25em;
        height: 1.25em;
        margin: 0.25em;
    }
</style>
