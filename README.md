# Atomic Pagination

This package generates JavaScript objects for building pagination.
Using the generated values, you can create your own pagination with modern web front-end frameworks such as React and Vue.

## Usage

install package

```
npm install atomic-pagination
```

### example

#### Vue(3.x)

```vue
<script setup>
import { pagination } from 'atomic-pagination'
import { defineProps, defineEmits, computed } from 'vue'
const props = defineProps({
  current: Number,
  last: Number,
})
const paginationData = computed(() => pagination({
  current: props.current,
  last: props.last,
}))
</script>

<template>
  <ul>
    <li v-if="paginationData.previous">
      <router-link :to="`/?page=${paginationData.previous}`">previous</router-link>
    </li>
    <li v-for="button in paginationData.buttons">
      <router-link :to="`/?page=${button.page}`">{{ button.page }}</router-link>
    </li>
    <li v-if="paginationData.next">
      <router-link :to="`/?page=${paginationData.next}`">next</router-link>
    </li>
  </ul>
</template>
```

## API

### pagination({setting})

#### Setting(argument)

|key|required|type|description|
|---|---|---|---
|current|o|number|number of current page|
|last|o|number|number of last page|
|first|-|number|number of first page|
|rangeDisplayed|-|number|number of buttons displayed (must be an odd number)|
|hasFirstAndLast|-|boolean|always display the first and last number of buttons or not|
|hasEllipsis|-|boolean|display ellipsis(...) when numbers are not next to each other or not|

#### Return value

|key|type|description|
|---|---|---|
|previous|number or null|number of previous page|
|next|number or null|number of next page|
|buttons|array|{ type: "page" \| "last" \| "first" \| "ellipsis"; current: boolean; page: number; }[]|

## Contributing

Contributions are welcome. Feel free to send a PR.

```sh
# development
pnpm i
pnpm dev
```
