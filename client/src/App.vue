<template>
	<div>
		<n-button>woo</n-button>
		<n-menu mode="horizontal" :options="menuOptions" />
		<div>
			<component :is="currentView" />
		</div>
	</div>
</template>

<script setup lang='ts'>
import { ref, h, computed } from 'vue'
import { RouterLink } from 'vue-router'
import Lobby from './views/Lobby.vue'
import About from './views/About.vue'
import type { MenuOption, NButton, NMenu } from 'naive-ui'
// import NotFound from './NotFound.vue'

const routes = {
	'/': Lobby,
	'/about': About
}

const menuOptions: MenuOption[] = [
	{
		label: () =>
			h(
				'a',
				{
					href: 'https://en.wikipedia.org/wiki/Hear_the_Wind_Sing'
				},
				'woo'
			)
		,
		key: 'pinball-1973'
	}
]

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
	currentPath.value = window.location.hash
})

const currentView = computed(() => {
	return routes[currentPath.value.slice(1) || '/']
})
</script>
