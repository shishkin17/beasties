// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu().append({
  files: ['**/test/**'],
  rules: {
    'no-console': 'off',
  },
})
