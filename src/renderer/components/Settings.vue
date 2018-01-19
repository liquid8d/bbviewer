<template>
    <div class="wrapper">
        <div class="container">
            <h1>{{ $t('settings') }}</h1>
        </div>
        <div class="container" style="flex-grow: 0;">
            <router-link to="/" tag="button">{{ $t('back') }}</router-link>
        </div>
    </div>
</template>

<script>
    import Utils from '@/mixins/Utils'
    export default {
        name: 'settings',
        mixins: [ Utils ],
        mounted () {
            this.preventDraggables()
        }
    }
</script>

<style>
    a {
        margin-right: 1em;
    }
</style>