<template>
  <div class="wrapper">
    <div class="container">
      <h1 class="title">{{ $t('welcome') }}</h1>
    </div>
    <div class="container" style="flex-grow: 0;">
      <router-link to="settings">{{ $t('settings') }}</router-link>
      <router-link to="about">{{ $t('about') }}</router-link>
    </div>
  </div>
</template>

<script>
  export default {
      name: 'home',
      methods: {
          open (link) {
              this.$electron.shell.openExternal(link)
          }
      }
  }
</script>

<style>
  a {
    margin-right: 1em;
  }
</style>
