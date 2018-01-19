<template>
  <div class="wrapper">
    <div class="container">
      <h1 class="title">{{ $t('welcome') }}</h1>
    </div>
    <div class="container" style="flex-grow: 0;">
      <!-- <template v-if="this.environment() === 'development'"> -->
        <router-link to="dev" tag="button">Dev</router-link>
      <!-- </template> -->
      <router-link to="settings" tag="button">{{ $t('settings') }}</router-link>
      <router-link to="about" tag="button">{{ $t('about') }}</router-link>
    </div>
  </div>
</template>

<script>
  import Utils from '@/mixins/Utils'
  export default {
      name: 'home',
      mixins: [ Utils ],
      mounted () {
          this.preventDraggables()
      },
      methods: {
          open (link) {
              this.$electron.shell.openExternal(link)
          }
      }
  }
</script>

<style>
</style>
