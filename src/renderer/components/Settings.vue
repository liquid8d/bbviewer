<template>
    <div class="wrapper">
        <div class="container">
            <h1>{{ $t('settings') }}</h1>
        </div>
        <div class="container" style="flex-grow: 0;">
            <router-link to="/">{{ $t('back') }}</router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'settings'
    }
</script>

<style>
    a {
        margin-right: 1em;
    }
</style>