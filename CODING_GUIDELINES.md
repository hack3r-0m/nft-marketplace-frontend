# Naming

* variable should be in camelCase
* global constant variables like configuration etc should be in CAPITAL_SNAKE_CASE 
* Class name must be in PascalCase
* Class member must be in camelCase

## File

files should be named in snake_case

## Stores (Vuex)

* state should be in camelCase
* mutations should be in CAPITAL_SNAKE_CASE
* action should be in camelCase
* getter should be in camelCase


# Vue

A vue component should be loose coupled or no coupled. So that it can work independently.
All dependencies should be passed using props except some states which are global like logged in user id, is authenticated etc.


## HTML

html codes should not exceed more than 50 lines. If exceeding, please try to break your code & create components.

### Filters

* Use filters for formatting code. Define filters globally if formatting is something generic, otherwise keep it in local component.

* Use filters when you have nested object and showing it in html.

* Filters can be chained, so design your logic in a way so that you can use multiple filters.

### Computed

In a case when you have to compute any expression and show the value in html or use if else or for , then use computed. 

## Script

script codes should not be more than 100 lines. It is natural for script codes to be large , in that case refactor your code by using mixins.

### Layers

There are three layer of this application - 

1. Component - UI
2. Service - Ajax or api calls
3. Store - state store

#### Component <-> Store

Component should communicate to Store and viceversa.

#### Store -> Service

Store should communicate to service layer and store the results in states. All Service call should be implemented in store actions.


### Service call

All service call should be made from actions, nothing from Component. So component know only stores, it doesn't need to know the service layer.

### data

Define variable inside data which needs reactivity otherwise initiate it in constructor or created hook.

## Style

No limit to style codes but try to refactor it and keep it in a seperate file, then import inside component.

## Accessing store

Always use map methods from store like mapGetters, mapState etc.

## Event naming

always use train-case for event naming & name should be something like a event like - click, loaded, item-loaded etc

```
<MyComponent @deleted="" @newuser-created=""> </MyComponent>
```

## Component naming

Use PascalCase for component naming inside html code. This helps us to identify custom made component when debugging.

```
<template>
    <MyComp/>
</template>
<script>
import MyComp from "@/component/my_comp";
export default{
    children: {
        MyComp
    }
}
</script>
```

# Vuex (Store)

* use namespaced store
* create a seperate store by feature wise or category wise (seperation depends upon the product, so anything is permitted) and make it namespaced. 
* create a seperate folder for each store and keep state, action, getter , mutation inside seperat file. Import all the codes into a index.js file treating store as a module.
* state should be created by calling a method,  which will return the initial state. So that we are not getting into issue of object reference.
* A getter should be only created if it computes something out of state. Only returning state from getters is not allowed.
* Action should call service, store the result in state & return the response if required.
* Follow naming conventions defined in naming sections.
* Every store should implement action "reset" which will be used to reset the store.
* Every store should implement mutation "RESET" which will be used to reset the state & will be called by action "reset".


# Modules

Try to create a modules for every functionality, even if it is small. And import that module everywhere instead of a particular file.

e.g - Consider we have to create util methods

1. isEmpty
2. isObject

we created two files is_empty.js & is_object inside utils folder.

now users can use it this way - 

```
import {isEmpty} from "./utils/is_empty";
```

or we can create a module of all the methods inside utils and user will have to import only utils folder.

create a folder index.js inside utils folder and export all methods like this

```
export * from "./is_empty";
export * from "./is_object";
```
and then users will use like this - 

```
import {isObject} from "./utils";
```
