import Vue from 'vue'
import { createApp } from './app'

const { app, router, store } = createApp();
// console.log(store.dispatch);
// store.dispatch('homeInfo');
// store.dispatch('NewsColumn');
// console.log(store.state);


// 非路由组件好像需要这个才能出发asyncData
Vue.mixin({
    beforeMount() {
        const { asyncData } = this.$options
        if (asyncData) {
            // 将获取数据操作分配给 promise
            // 以便在组件中，我们可以在数据准备就绪后
            // 通过运行 `this.dataPromise.then(...)` 来执行其他任务
            this.dataPromise = asyncData({
                store: this.$store,
                route: this.$route
            })
        }
    }
})
console.log('entry-client');
Vue.mixin({
    beforeRouteUpdate(to, from, next) {
        const { asyncData } = this.$options
        if (asyncData) {
            asyncData({
                store: this.$store,
                route: to
            }).then(next).catch(next)
        } else {
            next()
        }
    }
})



if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__);
}

router.onReady(() => {

    // 添加路由钩子函数，用于处理 asyncData.
    // 在初始路由 resolve 后执行，
    // 以便我们不会二次预取(double-fetch)已有的数据。
    // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
    // router.beforeResolve((to, from, next) => {
    //     const matched = router.getMatchedComponents(to)
    //     const prevMatched = router.getMatchedComponents(from)

    //     // 我们只关心非预渲染的组件
    //     // 所以我们对比它们，找出两个匹配列表的差异组件
    //     let diffed = false
    //     const activated = matched.filter((c, i) => {
    //         return diffed || (diffed = (prevMatched[i] !== c))
    //     })

    //     if (!activated.length) {
    //         return next()
    //     }

    //     // 这里如果有加载指示器 (loading indicator)，就触发

    //     Promise.all(activated.map(c => {
    //         if (c.asyncData) {
    //             return c.asyncData({ store, route: to })
    //         }
    //     })).then(() => {

    //         // 停止加载指示器(loading indicator)

    //         next()
    //     }).catch(next)
    // })


    app.$mount('#app', true);
})