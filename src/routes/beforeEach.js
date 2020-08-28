export const beforeEach = (to, from, next) => {
  console.log('crm beforeEach')
  next()
}
