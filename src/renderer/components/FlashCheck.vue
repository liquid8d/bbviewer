<template>
    <div class="page overlay">
        <div class="container stretch">
            <h1>{{$t('flash_title')}}</h1>
            <div v-if="flashAvailable()">
                <p v-html="$t('installed')"></p>
                <webview plugins src="https://helpx.adobe.com/content/dam/help/en/flash-player/assets/flash_tree.swf" style="width: 400px; height: 280px"></webview>
            </div>
            <div v-else>
                <!-- Install Necessary -->
                <p v-html="$t('no_install')"></p>
                <div v-if="!process.env.IS_WEB">
                    <!-- Desktop -->
                    <p v-html="$t('no_install_desktop')"></p>
                    <a href="#" @click="open('https://get.adobe.com/flashplayer/otherversions/')">https://get.adobe.com/flashplayer/otherversions/</a>
                    <p v-html="$t('no_install_desktop_footer')"></p>
                    <p v-html="$t('post_install')"></p>
                    <button @click="restartApp()">Restart BBViewer</button>
                </div>
                <div v-else>
                    <!-- Browser -->
                    <p v-html="$t('no_install_browser')"></p>
                    <ul>
                        <li><a href="#" @click="open('https://support.google.com/chrome/answer/6258784?hl=en')">{{$t('chrome')}}</a></li>
                        <li><a href="#" @click="open('https://helpx.adobe.com/flash-player/kb/enabling-flash-player-safari.html')">{{$t('safari')}}</a></li>
                        <li><a href="#" @click="open('https://support.mozilla.org/en-US/kb/set-adobe-flash-click-play-firefox')">{{$t('firefox')}}</a></li>
                        <li><a href="#" @click="open('https://helpx.adobe.com/flash-player/kb/flash-player-issues-windows-10-edge.html')">{{$t('edge')}}</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="container">
            <router-link tag="button" to="-1">Back</router-link>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "flash_title": "Adobe Flash",
        "no_install": "<font color=\"red\">Flash is not installed</font><p>Some streams provided by BBViewer require Adobe Flash. Adobe plans to support Flash through 2020, but using Flash may pose security risks. If you wish to access streams that use Flash, Additional steps including installing or enabling Flash are required. Please keep in mind that doing so is at your own risk.</p>",
        "no_install_browser": "Browser users may have Flash available, though browsers such as Chrome may not allow it by default, you'll need to enable it for this website. Click the Lock or Info icon, next to Flash change Ask to Allow on this site.",
        "no_install_desktop": "<h1>Installing Flash</h1><p>Download and install <b>PPAPI Flash (for Opera and Chromium)</b>:",
        "no_install_desktop_footer": "Make sure to <b>uncheck optional offers (McAfee) if you do not want them",
        "post_install": "Once Flash is installed, click the button below to restart BBViewer.",
        "chrome": "Chrome",
        "edge": "Edge",
        "firefox": "Firefox",
        "safari": "Safari",
        "installed": "<font color=\"green\">Flash is installed and available for use in BBViewer</font>"
    }
}
</i18n>

<script>
    import Utils from '@/mixins/Utils'
    export default {
        name: 'flashcheck',
        mixins: [ Utils ],
        methods: {
            flashAvailable () {
                return navigator.plugins['Shockwave Flash'] !== undefined
            }
        }
    }
</script>

<style scoped>
a {
    margin-left: 1em;
}
h2 {
    margin: 1em;
}
p {
    font-size: 0.75em;
    margin: 1em;
}
</style>