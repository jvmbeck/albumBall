<template>
  <q-layout>
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> Quasar App </q-toolbar-title>
        <DarkModeToggle />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import DarkModeToggle from '@/components/DarkModeToggle.vue'
</script>
