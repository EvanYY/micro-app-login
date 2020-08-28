// 组件内路由守卫
// beforeRouteEnter
// beforeRouteUpdate
// beforeRouteLeave
import { beforeEach } from './beforeEach'
import { afterEach } from './afterEach'
import { beforeResolve } from './beforeResolve'
import { onError } from './onError'
import { onReady } from './onReady'
import baseRoutes from './base-routes'
import addRoutes from './addRoutes'
const routes = baseRoutes.concat(addRoutes)
export { beforeEach, beforeResolve, afterEach, onError, onReady, routes }


